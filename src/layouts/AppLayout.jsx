import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="main-content">
        <Header onMenu={() => setOpen(v => !v)} />
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}
