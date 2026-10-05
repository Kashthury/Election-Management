import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return <div className="page-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>;
}
