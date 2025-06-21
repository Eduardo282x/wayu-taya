/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, PaginationContent, PaginationItem, PaginationLink, } from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead, } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Column } from "@/components/table/table.interface";
import { FC, useEffect, useRef, useState } from "react";
import { PagesInterface } from "./table.data";

import { Button } from "../ui/button";
import "./table.css";

interface TableProps {
  column: Column[];
  data: any[];
  actionTable: (action: string, data: any) => void;
  renderRow?: (item: any, index: number) => React.ReactNode;
  colSpanColumns?: boolean;
  isExpansible?: boolean;
}

export const TableComponents: FC<TableProps> = ({
  column,
  data,
  actionTable,
  renderRow,
  colSpanColumns,
  isExpansible
}) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<string>("10");

  useEffect(() => {
    setPage(0);
  }, [data, rowsPerPage]);

  const indexOfLastItem = (page + 1) * Number(rowsPerPage);
  const indexOfFirstItem = indexOfLastItem - Number(rowsPerPage);
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = data.length;

  return (
    <div className="w-full">
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {column.map((col: Column, index: number) => (
                <TableHead className={`${col.className && col.className(col)}`} key={index}>{col.label}</TableHead>
              ))}
              {isExpansible && (
                <TableHead className="cursor-pointer !z-50">
                  Abrir
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems && currentItems.length > 0 ? (currentItems.map((item, index: number) => (
              <>
                {isExpansible ?
                  <TableRowExpansible index={index} data={item} columns={column} action={actionTable} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={column} />
                  :
                  <TableRowNormal index={index} data={item} columns={column} action={actionTable} renderRow={renderRow} colSpanColumns={colSpanColumns} columnData={column} />
                }
              </>
            ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={column.length}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#6b7280",
                  }}
                >
                  No se encontraron datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems >= 10 && (
        <PaginationTable
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalElements={totalItems}
        />
      )}
    </div>
  );
};

interface TableRowNormalProps<T> {
  index: number;
  columns: Column[];
  columnData: Column[];
  data: T;
  colSpanColumns?: boolean;
  action?: (action: string, data: any) => void;
  renderRow?: (item: any, index: number) => React.ReactNode;
}

const TableRowNormal = <T,>({ index, columns, data, action }: TableRowNormalProps<T>) => {
  return (
    <TableRow key={index}>
      {columns && columns.map((col: Column, index: number) => (
        col.isIcon
          ? <ColumnIcon col={col} item={data} actionTable={action} key={index} />
          : <ColumnNormal col={col} item={data} actionTable={action} key={index} />
      ))}
    </TableRow>
  )
}

const TableRowExpansible = <T,>({ index, columns, data, action, renderRow }: TableRowNormalProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <TableRow
        key={`main-${index}`}
        ref={rowRef}
        onClick={() => setOpen(!open)}
        className="cursor-pointer transition-all"
      >
        {columns.map((column: Column, idx: number) => (
          !column.icon
            ? <ColumnNormal key={idx} col={column} item={data} actionTable={action} />
            : <ColumnIcon key={idx} col={column} item={data} actionTable={action} />
        ))}
        <TableCell>
          <IoIosArrowDown
            className={`transition-transform text-xl ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </TableCell>
      </TableRow>

      {/* Fila expandida */}
      <TableRow key={`expand-${index}`} className="bg-muted">
        <TableCell colSpan={columns.length + 1} className="!p-0">
          <div
            className={`transition-all duration-300 ease-in-out w-full ${open ? 'h-auto px-4 py-2' : '!h-0'} interpolate overflow-hidden`}
          >
            <p>{renderRow && renderRow(data, index)}</p>
          </div>
        </TableCell>
      </TableRow>
    </>
  )
}

interface ColumnCellProps {
  col: Column;
  item: any;
  actionTable?: (action: string, data: any) => void;
}

const ColumnNormal = ({ col, item }: ColumnCellProps) => {
  return (
    <TableCell>
      {col.element(item)}
    </TableCell>
  );
};

const ColumnIcon = ({ col, item, actionTable }: ColumnCellProps) => {
  return (
    <TableCell className={col.className ? col.className(item) : ""}>
      <Tooltip>
        <TooltipTrigger>
          <Button
            size={"icon"}
            className="py-[0.4rem] pl-[0.2rem] "
            variant={"icon"}
            onClick={() => actionTable && actionTable(col.column, item)}
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
  );
};

interface PaginationTableProps {
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: string;
  setRowsPerPage: (rowsPerPage: string) => void;
  totalElements: number;
}

const PaginationTable = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalElements,
}: PaginationTableProps) => {
  const [numberPage, setNumberPerPage] = useState<PagesInterface[]>([]);

  const totalPages = Math.ceil(totalElements / Number(rowsPerPage));

  useEffect(() => {
    const arrayPage = Array.from({ length: totalPages }, (_, i) => 1 + i * 1);

    const parseArray = arrayPage.map((item) => {
      return {
        value: item - 1,
        page: item,
      };
    });
    setNumberPerPage(parseArray);
  }, [totalElements, rowsPerPage, totalPages]);

  return (
    <div className="flex items-center justify-between w-full mt-4">
      <p>
        <span className="font-semibold">Total de elementos:</span>{" "}
        {totalElements}
      </p>

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
                disabled={page === 0}
                variant="noDefault"
                onClick={() => setPage(page - 1)}
                className="hover:bg-[#193db9] hover:text-white cursor-pointer text-black disabled:bg-gray-300 "
              >
                <IoIosArrowBack />
              </Button>
            </PaginationItem>

            {numberPage.map((item) => (
              <PaginationItem key={item.value}>
                <PaginationLink
                  className={`${page === item.value ? "border bg-[#193db9] text-white" : ""
                    } hover:bg-[#193db9] hover:text-white cursor-pointer`}
                  onClick={() => setPage(item.value)}
                >
                  {item.page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <Button
                disabled={page === totalPages - 1 || totalPages === 0}
                variant="noDefault"
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
  );
};
