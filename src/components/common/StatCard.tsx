import type { ComponentType, ReactNode } from "react";
import type { LucideProps } from "lucide-react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon?: ComponentType<LucideProps>;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return <div className="stat-card"><div className="stat-icon">{Icon && <Icon size={19}/>}</div><div><span>{title}</span><strong>{value}</strong></div></div>;
}
