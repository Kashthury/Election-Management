import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, pageCount, total, pageSize, setPage }: PaginationProps) {
  if (!pageCount) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);
  return <nav className="pagination" aria-label="Table pagination">
    <span className="pagination-count"><span>Showing</span><strong>{first}–{last}</strong><span>of</span><strong>{total}</strong><span>{total === 1 ? "record" : "records"}</span></span>
    {pageCount > 1 && <div className="pagination-controls">
      <button className="pagination-button" onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Previous page"><ChevronLeft size={16}/></button>
      <span className="pagination-page">Page <strong>{page}</strong> of <strong>{pageCount}</strong></span>
      <button className="pagination-button" onClick={() => setPage(page + 1)} disabled={page >= pageCount} aria-label="Next page"><ChevronRight size={16}/></button>
    </div>}
  </nav>;
}
