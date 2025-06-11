import { MoreVertical } from "lucide-react"
import { Button } from "../../../components/ui/button"
import type { DocumentData} from "../doc/types/document"

interface GridViewProps {
  data: DocumentData[]
}

export function GridView({ data }: GridViewProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <Button variant="ghost" size="sm" className="text-blue-600">
          <span className="sr-only">Ordenar</span>↑ Nombre
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden bg-white">
            <div className="bg-blue-100 p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-50 flex items-center justify-center rounded">
                  <img src="/placeholder.svg" alt="Thumbnail" width={16} height={16} className="object-cover" />
                </div>
                <span className="text-sm text-blue-800">{item.nombre}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical size={14} />
              </Button>
            </div>
            <div className="p-4 h-32 flex items-center justify-center bg-white">
              <img
                src="/placeholder.svg"
                alt="Document preview"
                width={100}
                height={100}
                className="object-contain max-h-full"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p>
          <span className="font-semibold">Total de elementos:</span> {data.length}
        </p>
      </div>
    </div>
  )
}
