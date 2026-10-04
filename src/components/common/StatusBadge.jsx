export default function StatusBadge({ status, children }) {
  const cls = status === "success" ? "success" : status === "danger" ? "danger" : status === "warning" ? "warning" : "neutral";
  return <span className={`status-badge ${cls}`}>{children}</span>;
}