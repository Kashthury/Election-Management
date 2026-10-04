export default function Button({ children, variant = "primary", icon: Icon, ...props }) {
  return <button className={`button ${variant}`} {...props}>{Icon && <Icon size={17}/>} {children}</button>;
}