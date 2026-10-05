import type { ReactNode } from "react";

interface StatusBadgeProps {
  status: string;
  children: ReactNode;
}

export default function StatusBadge({ status, children }: StatusBadgeProps) {
  const cls = status === "success" ? "success" : status === "danger" ? "danger" : status === "warning" ? "warning" : "neutral";
  return <span className={`status-badge ${cls}`}>{children}</span>;
}
