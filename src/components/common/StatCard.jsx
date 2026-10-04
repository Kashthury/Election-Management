export default function StatCard({ title, value, icon: Icon }) {
  return <div className="stat-card"><div className="stat-icon">{Icon && <Icon size={19}/>}</div><div><span>{title}</span><strong>{value}</strong></div></div>;
}