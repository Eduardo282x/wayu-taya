/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Column } from "@/components/table/table.interface";
import { FC, useEffect, useState } from "react";
import { PagesInterface } from "./table.data";
import { Button } from "../ui/button";
interface TableProps {
  column: Column[];
  data: any[];
  actionTable: (action: string, data: any) => void
}

export const TableComponents: FC<TableProps> = ({ column, data, actionTable }) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<string>('10');

  return (
    <div className="w-full">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {column.map((col: Column, index: number) => (
                <TableHead key={index}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.slice(page * Number(rowsPerPage), page * Number(rowsPerPage) + Number(rowsPerPage)).map((item, index: number) => (
              <TableRow key={index}>
                {column.map((col: Column, index: number) => {
                  if (col.isIcon) {
                    return <ColumnIcon col={col} item={item} actionTable={actionTable} key={index} />
                  }
                  else {
                    return <ColumnNormal col={col} item={item} actionTable={actionTable} key={index} />
                  }
                }
                )}
              </TableRow>
            ))}

            {data.length == 0 && (
              <TableRow>
                <TableCell colSpan={column.length} style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                  No se encontraron datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 10 && (
        <PaginationTable
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalElements={data.length}
        />
      )}
    </div>
  );
};

interface ColumnCellProps {
  col: Column;
  item: any;
  actionTable: (action: string, data: any) => void
}

const ColumnNormal = ({ col, item }: ColumnCellProps) => {
  return (
    <TableCell className={col.className ? col.className(item) : ''}>
      {col.element(item)}
    </TableCell>
  )
}

const ColumnIcon = ({ col, item, actionTable }: ColumnCellProps) => {
  return (
    <TableCell className={col.className ? col.className(item) : ''}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            className="py-[0.4rem] pl-[0.2rem] "
            variant={'icon'}
            onClick={() => actionTable(col.column, item)}
          >
            {col.icon && (
              <col.icon.icon className={`${col.icon.className} size-4.5`} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="opacity-70" side="left">
          <span>{col.icon?.label}</span>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  )
}


interface PaginationTableProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: string;
  setRowsPerPage: (rowsPerPage: string) => void;
  totalElements: number
}

const PaginationTable = ({ page, setPage, rowsPerPage, setRowsPerPage, totalElements }: PaginationTableProps) => {
  const [numberPage, setNumberPerPage] = useState<PagesInterface[]>([])

  useEffect(() => {
    const totalPaginate = Math.ceil(totalElements / Number(rowsPerPage))
    const arrayPage = Array.from(
      { length: totalPaginate },
      (_, i) => 1 + i * 1,
    )

    const parseArray = arrayPage.map(item => {
      return {
        value: item - 1,
        page: item
      }
    })
    setNumberPerPage(parseArray)
  }, [totalElements, rowsPerPage])

  return (
    <div className="flex items-center justify-between w-full mt-4">
      <p><span className="font-semibold">Total de elementos:</span> {totalElements}</p>

      <div className="flex items-center justify-center gap-2">
        <div className="flex justify-start items-center gap-2">
          <span className="font-semibold text-gray-700">
            Elementos por página:
          </span>
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
                disabled={page == 0}
                variant='noDefault'
                onClick={() => setPage(page - 1)}
                className="hover:bg-[#193db9] hover:text-white cursor-pointer text-black disabled:bg-gray-300 "
              >
                <IoIosArrowBack />
              </Button>
            </PaginationItem>

            {numberPage.map((item) => (
              <PaginationItem key={item.value}>
                <PaginationLink className={`${page == item.value ? 'border bg-[#193db9] text-white' : ''} hover:bg-[#193db9] hover:text-white cursor-pointer`} onClick={() => setPage(item.value)}>{item.page}</PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Button disabled={page == 4}
                variant='noDefault'
                onClick={() => setPage(page + 1)}
                className="hover:bg-[#193db9] hover:text-white cursor-pointer text-black disabled:bg-gray-300 "
              >
                <IoIosArrowForward />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
