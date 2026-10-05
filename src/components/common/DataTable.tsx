import type { ReactNode } from "react";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
}

export default function DataTable({ columns, children }: DataTableProps) {
  return <div className="table-scroll"><table className="data-table"><thead><tr>{columns.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
