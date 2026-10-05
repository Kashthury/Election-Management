import type { ButtonHTMLAttributes, ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  icon?: ComponentType<LucideProps>;
};

export default function Button({ children, variant = "primary", icon: Icon, ...props }: ButtonProps) {
  return <button className={`button ${variant}`} {...props}>{Icon && <Icon size={17}/>} {children}</button>;
}
