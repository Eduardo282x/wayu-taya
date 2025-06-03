/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Column } from "@/interfaces/table.interface";
import { FC, useState } from "react";
import { pagesData } from "./table.data";
import { Button } from "../ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface TableProps {
  column: Column[];
  data: any[];
}

export const TableComponents: FC<TableProps> = ({ column, data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="w-full">
      <div className="w-full h-[25rem] overflow-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {column.map((col: Column, index: number) => (
                <TableHead key={index}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index: number) => (
              <TableRow key={index}>
                {column.map((col: Column, index: number) => (
                  <TableCell key={index}>{col.element(item)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationTable
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalElements={data.length}
      />
    </div>
  );
};

interface PaginationTableProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  totalElements: number
}

const PaginationTable = ({ page, setPage, rowsPerPage, setRowsPerPage, totalElements }: PaginationTableProps) => {
  // const [pages, setPages] = useState<PagesInterface[]>(pagesData);

  return (
    <div className="flex items-center justify-between w-full mt-2">
      <p><span className="font-semibold">Total de elementos:</span> {totalElements}</p>

      <div className="flex items-center justify-center gap-2">
        <div className="flex justify-start items-center gap-2">
          <span className="font-semibold text-gray-700">
            Elementos por página:
          </span>
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value}>
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

            {pagesData.map((item) => (
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
