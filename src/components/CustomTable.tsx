import { ColumnHeader } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Props<T> {
  columnHeader: ColumnHeader<T>[];
  columnData: T[];
}

export default function CustomTable<T extends { id: number | string }>({
  columnHeader,
  columnData,
}: Props<T>) {
  return (
    <div className="w-full ">
      <Table>
        <TableHeader>
          <TableRow className="text-[11px] text-white/20 uppercase tracking-wider">
            {columnHeader.map((col) => (
              <TableHead
                key={String(col.id)}
                className="px-5 py-3 font-medium text-left"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {columnData.map((item) => (
            <TableRow
              key={item.id}
              className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
            >
              {columnHeader.map((col) => (
                <TableCell
                  key={String(col.id)}
                  className="px-5 py-3 text-xs text-white/70 group-hover:text-white transition-colors"
                >
                  {col.cellRender
                    ? col.cellRender(item)
                    : (item[col.id] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
