import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = useMemo(() => items.slice((currentPage - 1) * pageSize, currentPage * pageSize), [items, currentPage, pageSize]);
  const pagination = items.length >= pageSize ? {
    page: currentPage,
    pageCount,
    total: items.length,
    pageSize,
    setPage: (nextPage: number) => setPage(Math.min(pageCount, Math.max(1, nextPage))),
  } : null;
  return { pageItems, pagination, resetPage: () => setPage(1) };
}
