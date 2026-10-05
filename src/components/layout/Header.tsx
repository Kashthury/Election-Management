import { Menu, Vote } from "lucide-react";

export default function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="topbar">
    <button className="menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20}/></button>
    <a className="topbar-brand" href="/" aria-label="Election Management home"><span><Vote size={17}/></span><strong>Election Management</strong></a>
    <span className="topbar-context">Administration portal</span>
    <span className="mode-badge"><i/> Development mode</span>
  </header>;
}
