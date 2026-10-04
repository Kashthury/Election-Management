import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Users, Vote, BarChart3, FileText, X } from "lucide-react";
import { ROUTES } from "../../constants/routes";

const groups = [
  { label: "Workspace", items: [{ label: "Dashboard", icon: LayoutDashboard, to: ROUTES.DASHBOARD }] },
  { label: "Election Setup", items: [{ label: "Configuration", icon: Settings, to: ROUTES.CONFIGURATION }, { label: "Nominations", icon: Users, to: ROUTES.NOMINATION }] },
  { label: "Election Operations", items: [{ label: "Vote Entry", icon: Vote, to: ROUTES.ELECTION }, { label: "Results", icon: BarChart3, to: ROUTES.RESULTS }, { label: "Reports", icon: FileText, to: ROUTES.REPORTS }] },
];

export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "mobile-open" : ""}`}>
      <div className="brand">
        <div className="brand-logo"><Vote size={20}/></div>
        <div><strong>Election Management</strong><small>Administration portal</small></div>
        <button className="mobile-close" onClick={onClose}><X size={18}/></button>
      </div>
      <nav className="side-nav">
        {groups.map(group => <section className="nav-group" key={group.label} aria-label={group.label}>
          <div className="nav-label group-label">{group.label}</div>
          {group.items.map(item => <NavLink end={item.to === ROUTES.DASHBOARD} key={item.to} to={item.to} onClick={onClose} className={({isActive}) => `nav-link ${isActive ? "active":""}`}>
            <item.icon size={18}/><span>{item.label}</span><span className="nav-link-indicator"/>
          </NavLink>)}
        </section>)}
      </nav>
      <div className="sidebar-footer"><span className="online-dot"/> Mock data mode</div>
    </aside>
  );
}
