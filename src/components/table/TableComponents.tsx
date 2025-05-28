  /* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Column } from "@/interfaces/table.interface";
import { FC, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TableProps {
  column: Column[];
  data: any[];
}

export const TableComponents: FC<TableProps> = ({ column, data }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {column.map((col: Column, index: number) => (
              <TableHead key={index}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index: number) => (
            <TableRow key={index}>
              {column.map((col: Column, index: number) => (
                <TableCell key={index}>{col.element(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div>
        <Pagination className="flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>

            {[1, 2, 3].map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink href="#">{pageNumber}</PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
