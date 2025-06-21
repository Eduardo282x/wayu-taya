import { useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../../../components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Button } from "../../../components/ui/button"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { DocumentData, ColumnDefinition } from "./documents.data"

interface PageData {
  page: string
  value: number
}

interface TableComponentsProps {
  column: ColumnDefinition[]
  data: DocumentData[]
}

export const TableComponents = ({ column, data }: TableComponentsProps) => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<string>("10")

  const pagesData: PageData[] = [
    { page: "1", value: 0 },
    { page: "2", value: 1 },
    { page: "3", value: 2 },
    { page: "4", value: 3 },
    { page: "5", value: 4 },
  ]

  return (
    <div className="w-full">
      <div className="w-full h-[25rem] overflow-auto">
        <Table className="w-full">
          <TableHeader className="bg-blue-50">
            <TableRow>
              {column.map((col, index) => (
                <TableHead key={index} className="text-blue-700">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data
                .slice(page * Number(rowsPerPage), page * Number(rowsPerPage) + Number(rowsPerPage))
                .map((item, index) => (
                  <TableRow key={index} className="bg-blue-100 even:bg-blue-50 hover:bg-blue-200">
                    {column.map((col, index) => (
                      <TableCell key={index}>{col.element(item)}</TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between w-full mt-2">
        <p>
          <span className="font-semibold">Total de elementos:</span> {data.length}
        </p>

        <div className="flex items-center justify-center gap-2">
          <div className="flex justify-start items-center gap-2">
            <span className="font-semibold text-gray-700">Elementos por página:</span>
            <Select value={rowsPerPage.toString()} onValueChange={setRowsPerPage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 20, 50, 100].map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Pagination className="flex justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  disabled={page === 0}
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  className="hover:bg-blue-600 hover:text-white cursor-pointer text-black disabled:bg-gray-300"
                >
                  <IoIosArrowBack />
                </Button>
              </PaginationItem>

              {pagesData.map((item) => (
                <PaginationItem key={item.value}>
                  <PaginationLink
                    className={`${page === item.value ? "border bg-blue-600 text-white" : ""} hover:bg-blue-600 hover:text-white cursor-pointer`}
                    onClick={() => setPage(item.value)}
                  >
                    {item.page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  disabled={page === 4}
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  className="hover:bg-blue-600 hover:text-white cursor-pointer text-black disabled:bg-gray-300"
                >
                  <IoIosArrowForward />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}
