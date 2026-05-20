import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(true);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header
        OpenSidebar={OpenSidebar}
        openSidebarToggle={openSidebarToggle}
      />

      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      <main
        className={`main-content ${
          openSidebarToggle ? "sidebar-open" : "sidebar-close"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}