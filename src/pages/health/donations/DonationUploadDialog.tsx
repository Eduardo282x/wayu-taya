import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogHeader,
  StyledDialogTitle,
  StyledDialogDescription,
  StyledDialogFooter,
} from "@/components/StyledDialog/StyledDialog"
import { Button } from "@/components/ui/button"
import { Upload, Download, FileSpreadsheet, ClipboardPaste, Trash2, Plus, Loader2, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TableComponents } from "@/components/table/TableComponents"
import { Column } from "@/components/table/table.interface"
import { getDonationsExcelTemplate } from "@/services/donations/donations.service"
import { getMedicinesPage } from "@/services/medicine/medicine.service"
import { DonationMedicine } from "@/services/donations/donations.interface"
import { IMedicine, MedicineBody, Category, Form } from "@/services/medicine/medicine.interface"
import { MedicineForm } from "../medicine/MedicineForm"
import { formatDateForInput } from "@/utils/formatters"
import { donationImportRowSchema } from "@/lib/import-schemas"

type RowStatus = "valid" | "warning" | "error"
type ImportMode = "file" | "paste"

interface ParsedRow {
  medicina: string
  cantidad: string
  lote: string
  fechaExpiracion: string
}

interface ValidatedRow {
  rowNumber: number
  medicina: string
  cantidad: string
  lote: string
  fechaExpiracion: string
  status: RowStatus
  errors: string[]
  medicineId: number | null
  newMedicine: boolean
}

interface DonationUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  medicines: IMedicine[]
  createdMedicines: IMedicine[]
  categories: Category[]
  forms: Form[]
  onCreateMedicine: (data: MedicineBody) => Promise<IMedicine | null>
  onApply: (rows: DonationMedicine[]) => void
}

const HEADERS = ["Medicina", "Cantidad", "Lote", "Fecha de Expiración"]

const normalizeText = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")

const stringifyCell = (value: unknown): string => {
  if (value === null || value === undefined) return ""
  return String(value).trim()
}

const formatMedicineLabel = (med: IMedicine): string =>
  `${med.name} - ${(med.presentation ?? "").trim()}`

const extractMedicineName = (label: string): string => {
  const idx = label.indexOf(" - ")
  return idx >= 0 ? label.slice(0, idx).trim() : label.trim()
}

const extractPresentation = (label: string): string => {
  const idx = label.indexOf(" - ")
  return idx >= 0 ? label.slice(idx + 3).trim() : ""
}

const matchesMedicine = (med: IMedicine, value: string): boolean => {
  const target = normalizeText(value)
  return target === normalizeText(med.name) || target === normalizeText(formatMedicineLabel(med))
}

export const DonationUploadDialog = ({
  open,
  onOpenChange,
  medicines,
  createdMedicines,
  categories,
  forms,
  onCreateMedicine,
  onApply,
}: DonationUploadDialogProps) => {
  const [mode, setMode] = useState<ImportMode>("file")
  const [fileName, setFileName] = useState("")
  const [pasteContent, setPasteContent] = useState("")
  const [rows, setRows] = useState<ValidatedRow[]>([])
  const [parsing, setParsing] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(false)
  const [newsCreated, setNewsCreated] = useState<IMedicine[]>(createdMedicines)
  const [remoteMedicines, setRemoteMedicines] = useState<IMedicine[]>([])
  const [medicineFormOpen, setMedicineFormOpen] = useState(false)
  const [medicineFormRow, setMedicineFormRow] = useState<number | null>(null)
  const [alert, setAlert] = useState<string>("")

  const knownMedicines = useMemo(() => {
    const combined = [...medicines, ...newsCreated, ...remoteMedicines]
    return combined.filter((med, i, arr) => arr.findIndex((m) => m.id === med.id) === i)
  }, [medicines, newsCreated, remoteMedicines])

  const medicineFormInitialValues = useMemo<Partial<MedicineBody> | undefined>(() => {
    if (medicineFormRow == null) return undefined
    const row = rows.find((item) => item.rowNumber === medicineFormRow)
    if (!row) return undefined
    return {
      name: extractMedicineName(row.medicina),
      presentation: extractPresentation(row.medicina),
    }
  }, [medicineFormRow, rows])

  useEffect(() => {
    setNewsCreated(createdMedicines)
  }, [createdMedicines])

  useEffect(() => {
    if (open) {
      resetData()
    }
  }, [open])

  const resetData = () => {
    setRows([])
    setFileName("")
    setPasteContent("")
    setAlert("")
  }

  const downloadTemplate = async () => {
    setTemplateLoading(true)
    try {
      const response = await getDonationsExcelTemplate()
      const url = URL.createObjectURL(response)
      const link = document.createElement("a")
      link.href = url
      link.download = `Plantilla de donacion ${new Date().toISOString()}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      setAlert("No fue posible generar la plantilla.")
    } finally {
      setTemplateLoading(false)
    }
  }

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setParsing(true)
    setAlert("")

    file
      .arrayBuffer()
      .then((buffer) => parseWorkbook(buffer))
      .then(async (parsed) => {
        const validated = validateRows(parsed)
        setRows(validated)
        const enriched = await enrichRows(validated)
        setRows(enriched)
      })
      .catch(() => {
        setRows([])
        setAlert("No fue posible leer el archivo seleccionado.")
      })
      .finally(() => {
        setParsing(false)
        event.target.value = ""
      })
  }

  const parseWorkbook = (buffer: ArrayBuffer): ParsedRow[] => {
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true })
    const sheetName =
      workbook.SheetNames.find((name) => normalizeText(name).includes("donacion")) ??
      workbook.SheetNames.find((name) => !name.startsWith("_")) ??
      workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    if (!sheet) return []

    const records = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: true,
    })

    return records.map((record) => {
      const keys = Object.keys(record)
      const findKey = (part: string) => keys.find((k) => normalizeText(k).includes(part.toLowerCase()))
      const medicinaKey = findKey("medicina") ?? findKey("Medicina")
      const cantidadKey = findKey("cantidad")
      const loteKey = findKey("lote")
      const fechaKey = findKey("expiracion")

      const fechaRaw = fechaKey ? record[fechaKey] : ""
      return {
        medicina: stringifyCell(medicinaKey ? record[medicinaKey] : ""),
        cantidad: stringifyCell(cantidadKey ? record[cantidadKey] : ""),
        lote: stringifyCell(loteKey ? record[loteKey] : ""),
        fechaExpiracion: normalizeDateCell(fechaRaw),
      }
    })
  }

  const normalizeDateCell = (value: unknown): string => {
    if (value instanceof Date) {
      return formatDateForInput(value)
    }
    const str = stringifyCell(value)
    if (!str) return ""
    const match = str.match(/(\d{4})[-/](\d{2})[-/](\d{2})/)
    if (match) return `${match[1]}-${match[2]}-${match[3]}`
    const parts = str.split(/[-/\s]/)
    if (parts.length === 3) {
      const [a, b, c] = parts
      if (a.length === 4) return `${a}-${b.padStart(2, "0")}-${c.padStart(2, "0")}`
      if (c.length === 4) return `${c}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`
    }
    return str
  }

  const parsePasteContent = async () => {
    const content = pasteContent.trim()
    if (!content) {
      setAlert("Pega filas copiadas desde Excel antes de validar.")
      return
    }
    setAlert("")
    setParsing(true)
    try {
      const lines = content
        .split(/\r?\n/)
        .map((line) => line.trimEnd())
        .filter((line) => line.trim().length > 0)

      if (lines.length === 0) {
        setRows([])
        return
      }

      const firstColumns = lines[0].split("\t").map((cell) => cell.trim())
      const hasHeader = firstColumns.some((cell) =>
        HEADERS.some((h) => normalizeText(h) === normalizeText(cell))
      )
      const dataLines = hasHeader ? lines.slice(1) : lines

      const parsed = dataLines.map((line) => {
        const [medicina = "", cantidad = "", lote = "", fechaExpiracion = ""] = line.split("\t")
        return {
          medicina: medicina.trim(),
          cantidad: cantidad.trim(),
          lote: lote.trim(),
          fechaExpiracion: normalizeDateCell(fechaExpiracion.trim()),
        }
      })
      const validated = validateRows(parsed)
      setRows(validated)
      const enriched = await enrichRows(validated)
      setRows(enriched)
    } finally {
      setParsing(false)
    }
  }

  const enrichRows = async (validated: ValidatedRow[]): Promise<ValidatedRow[]> => {
    const unmatchedNames = Array.from(
      new Set(validated.filter((row) => row.newMedicine && row.medicina).map((row) => row.medicina))
    )

    if (unmatchedNames.length === 0) return validated

    const matches = await Promise.all(
      unmatchedNames.map(async (label) => {
        try {
          const response = await getMedicinesPage({ page: 1, size: 10, name: extractMedicineName(label) })
          const found = response?.medicines ?? []
          return found.find((med) => matchesMedicine(med, label)) ?? null
        } catch {
          return null
        }
      })
    )

    const foundMedicines = matches.filter((med): med is IMedicine => med != null)
    if (foundMedicines.length > 0) {
      setRemoteMedicines((prev) => {
        const next = [...prev]
        foundMedicines.forEach((med) => {
          if (!next.some((item) => item.id === med.id)) next.push(med)
        })
        return next
      })
    }

    const byLabel = new Map<string, IMedicine>()
    foundMedicines.forEach((med) => {
      byLabel.set(normalizeText(med.name), med)
      byLabel.set(normalizeText(formatMedicineLabel(med)), med)
    })
    return validated.map((row) => {
      const match = byLabel.get(normalizeText(row.medicina))
      if (!match || !row.newMedicine) return row
      const errors = row.errors.filter((error) => !error.includes("no registrada"))
      return {
        ...row,
        medicineId: match.id,
        newMedicine: false,
        status: errors.length > 0 ? "error" : "valid",
        errors,
      }
    })
  }

  const validateRows = (parsed: ParsedRow[]): ValidatedRow[] => {
    return parsed
      .map((row, index) => validateRow(row, index + 2))
      .filter((row) => hasUsefulRow(row))
  }

  const validateRow = (row: ParsedRow, rowNumber: number): ValidatedRow => {
    // Fuente unica de reglas (compartida con el backend).
    const parsed = donationImportRowSchema.safeParse(row)
    const errors: string[] = parsed.success
      ? []
      : parsed.error.issues.map((issue) => issue.message)

    const medicina = row.medicina.trim()
    const matched = knownMedicines.find((med) => matchesMedicine(med, medicina))
    const newMedicine = medicina !== "" && !matched

    if (newMedicine && errors.length === 0) {
      errors.push("Medicina no registrada: completa sus datos para poder crearla.")
    }

    return {
      rowNumber,
      medicina,
      cantidad: row.cantidad.trim(),
      lote: row.lote.trim(),
      fechaExpiracion: row.fechaExpiracion,
      status: errors.length > 0 ? (newMedicine ? "warning" : "error") : "valid",
      errors,
      medicineId: matched ? matched.id : null,
      newMedicine,
    }
  }

  const hasUsefulRow = (row: ValidatedRow): boolean =>
    [row.medicina, row.cantidad, row.lote, row.fechaExpiracion].some((v) => v.trim().length > 0)

  const isApplicable = (row: ValidatedRow): boolean =>
    row.status === "valid" && row.medicineId != null

  const openCreateMedicine = (row: ValidatedRow) => {
    setMedicineFormRow(row.rowNumber)
    setMedicineFormOpen(true)
  }

  const handleCreateMedicine = async (formData: MedicineBody) => {
    try {
      const created = await onCreateMedicine(formData)
      if (!created) {
        setAlert("No se pudo crear la medicina.")
        return
      }
      setNewsCreated((prev) => [...prev, created])
      setRows((prev) =>
        prev.map((row) => {
          if (row.rowNumber !== medicineFormRow) return row
          const errors = row.errors.filter((e) => !e.includes("no registrada"))
          return {
            ...row,
            medicineId: created.id,
            newMedicine: false,
            status: errors.length > 0 ? "error" : "valid",
            errors,
          }
        })
      )
      setMedicineFormOpen(false)
      setMedicineFormRow(null)
      setAlert("")
    } catch {
      setAlert("Error inesperado al crear la medicina.")
    }
  }

  const applyRows = () => {
    const selected = rows.filter(isApplicable)
    if (selected.length === 0) {
      setAlert("No hay filas válidas aplicables. Revisa el preview.")
      return
    }

    const applied: DonationMedicine[] = selected.map((row, index) => ({
      id: index + 1,
      medicineId: row.medicineId as number,
      details: [
        {
          amount: Number(row.cantidad) || 0,
          storageId: 0,
          lote: row.lote || "",
          benefited: 1,
        },
      ],
      expirationDate: row.fechaExpiracion || formatDateForInput(new Date()),
    }))

    onApply(applied)
    onOpenChange(false)
  }

  const clearRows = () => {
    setRows([])
    setFileName("")
    setPasteContent("")
    setAlert("")
  }

  const validCount = rows.filter((row) => row.status !== "error").length
  const errorCount = rows.filter((row) => row.status === "error").length
  const warningCount = rows.filter((row) => row.newMedicine).length
  const includedCount = rows.filter(isApplicable).length

  const rowBg = (row: ValidatedRow): string => {
    if (row.status === "error") return "bg-red-50"
    if (row.newMedicine) return "bg-yellow-50"
    return ""
  }

  const previewColumns: Column[] = [
    {
      label: "Medicina",
      column: "medicina",
      visible: true,
      // className: (row: ValidatedRow) => rowBg(row),
      className: () => 'max-w-100 w-100 overflow-hidden text-ellipsis truncate',
      element: (row: ValidatedRow) => <span>{row.medicina || "-"}</span>,
    },
    {
      label: "Cantidad",
      column: "cantidad",
      visible: true,
      className: (row: ValidatedRow) => rowBg(row),
      element: (row: ValidatedRow) => <span>{row.cantidad || "-"}</span>,
    },
    {
      label: "Lote",
      column: "lote",
      visible: true,
      className: (row: ValidatedRow) => rowBg(row),
      element: (row: ValidatedRow) => <span>{row.lote || "-"}</span>,
    },
    {
      label: "Fecha Expiración",
      column: "fechaExpiracion",
      visible: true,
      className: (row: ValidatedRow) => rowBg(row),
      element: (row: ValidatedRow) => <span>{row.fechaExpiracion || "-"}</span>,
    },
    {
      label: "Estado",
      column: "estado",
      visible: true,
      className: (row: ValidatedRow) => rowBg(row),
      element: (row: ValidatedRow) => {
        const statusLabel =
          row.status === "error" ? (
            <span className="text-xs font-semibold text-red-600">Error</span>
          ) : row.newMedicine ? (
            <span className="text-xs font-semibold text-yellow-600">Nueva medicina</span>
          ) : (
            <span className="text-xs font-semibold text-green-600">Válida</span>
          )

        if (row.errors.length === 0) return statusLabel

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex cursor-help">{statusLabel}</span>
            </TooltipTrigger>
            <TooltipContent className="max-w-64">
              <ul className="space-y-0.5">
                {row.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      label: "",
      column: "accion",
      visible: true,
      className: (row: ValidatedRow) => rowBg(row),
      element: (row: ValidatedRow) =>
        row.newMedicine ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-[#0250b0] text-[#0250b0]"
            onClick={() => openCreateMedicine(row)}
          >
            <Plus className="w-4 h-4 mr-1" /> Crear
          </Button>
        ) : null,
    },
  ]

  const guideItems = [
    'Completa una fila por cada medicina en la hoja "Donacion".',
    'En la columna "Medicina" usa el formato "Nombre - Presentación" (ej: Amoxicilina - Suspensión 250mg/5ml), tal como viene en la plantilla.',
    'La columna "Cantidad" debe ser un número entero mayor a 0.',
    'El formato de "Fecha de Expiración" es AAAA-MM-DD (ej: 2027-12-31).',
    'Si escribes una medicina que no existe, deberás completar sus datos con el botón "Crear" para poder incluirla.',
    'Revisa la vista previa antes de aplicar los cambios al formulario.',
  ]

  return (
    <>
      <StyledDialog open={open} onOpenChange={onOpenChange}>
        <StyledDialogContent className="sm:max-w-5xl max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto bg-gray-100">
          <StyledDialogHeader>
            <div className="flex items-start justify-between gap-4 pr-10">
              <div>
                <StyledDialogTitle>Cargar donación por Excel</StyledDialogTitle>
                <StyledDialogDescription>
                  Descarga la plantilla, complétala y valida las filas antes de aplicar. Las
                  medicinas no registradas deben completarse para poder crearlas.
                </StyledDialogDescription>
              </div>
            </div>
          </StyledDialogHeader>

          <Accordion type="single" collapsible className="rounded-md border border-gray-300 px-3">
            <AccordionItem value="guia" className="border-b-0">
              <AccordionTrigger className="py-2.5 text-sm font-medium text-[#0250b0]">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" /> Guía de uso
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                  {guideItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="space-y-4 p-1">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={mode === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("file")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1" /> Archivo Excel
                </Button>
                <Button
                  type="button"
                  variant={mode === "paste" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("paste")}
                >
                  <ClipboardPaste className="w-4 h-4 mr-1" /> Pegar desde Excel
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={downloadTemplate}
                disabled={templateLoading || parsing}
                className="shrink-0 border-[#0250b0] text-[#0250b0]"
              >
                <Download className="w-4 h-4 mr-1" />
                {templateLoading ? "Descargando..." : "Plantilla"}
              </Button>
            </div>

            {mode === "file" && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-500 hover:border-[#0250b0] hover:bg-blue-50">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <strong className="text-sm text-gray-900">
                  {fileName || "Selecciona el archivo completado"}
                </strong>
                <span className="text-xs text-gray-500">Formatos soportados: .xlsx y .xls</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelected}
                  disabled={parsing}
                />
                <span className="mt-3 inline-flex items-center px-4 py-1.5 text-sm rounded-md text-white bg-[#0250b0] hover:bg-blue-900">
                  Buscar archivo
                </span>
              </label>
            )}

            {mode === "paste" && (
              <div className="space-y-2">
                <textarea
                  rows={8}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Pega aquí las filas copiadas desde Excel (con o sin encabezado)."
                  className="w-full rounded-md border border-gray-400 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0250b0]"
                />
                <div className="flex justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={parsePasteContent} disabled={parsing}>
                    Validar pegado
                  </Button>
                </div>
              </div>
            )}

            {parsing && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Validando archivo...
              </div>
            )}

            {rows.length > 0 && (
              <>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total: </span>
                    <strong>{rows.length}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Válidas: </span>
                    <strong>{validCount - warningCount}</strong>
                  </div>
                  <div>
                    <span className="text-yellow-600">Nuevas medicinas: </span>
                    <strong>{warningCount}</strong>
                  </div>
                  <div>
                    <span className="text-red-600">Con error: </span>
                    <strong>{errorCount}</strong>
                  </div>
                  <div>
                    <span className="text-[#0250b0]">A aplicar: </span>
                    <strong>{includedCount}</strong>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <TableComponents
                    column={previewColumns}
                    data={rows}
                    actionTable={() => { }}
                    getRowId={(row: ValidatedRow) => row.rowNumber}
                  />
                </div>
              </>
            )}

            {rows.length === 0 && !parsing && (
              <div className="text-center text-sm text-gray-500 py-6">No hay filas validadas todavía.</div>
            )}

            {alert && <p className="text-red-600 font-semibold text-sm">{alert}</p>}
          </div>

          <StyledDialogFooter>
            <div className="flex justify-between items-center w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearRows}
                disabled={rows.length === 0}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Limpiar
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="button" variant="animated" onClick={applyRows} disabled={includedCount === 0}>
                  Aplicar al formulario
                </Button>
              </div>
            </div>
          </StyledDialogFooter>
        </StyledDialogContent>
      </StyledDialog>

      <StyledDialog open={medicineFormOpen} onOpenChange={setMedicineFormOpen}>
        <StyledDialogContent className="sm:max-w-2xl max-w-[95vw] w-full mx-4 max-h-[90vh] overflow-y-auto">
          <StyledDialogHeader>
            <StyledDialogTitle>Agregar Nueva Medicina</StyledDialogTitle>
            <StyledDialogDescription>
              Completa los datos para registrar la medicina cargada desde el Excel.
            </StyledDialogDescription>
          </StyledDialogHeader>
          <MedicineForm
            ignoreHeader={true}
            open={medicineFormOpen}
            onOpenChange={setMedicineFormOpen}
            onSubmit={handleCreateMedicine}
            medicineData={null}
            initialValues={medicineFormInitialValues}
            categories={categories}
            forms={forms}
          />
        </StyledDialogContent>
      </StyledDialog>
    </>
  )
}
