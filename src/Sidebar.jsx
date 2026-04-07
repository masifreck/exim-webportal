import React, { useState, useEffect, useMemo } from "react";
import {
  MdDashboard,
  MdAssignment,
  MdReportProblem,
  MdSettings,
  MdSettingsApplications,
  MdLogout,
  MdLocalShipping,
  MdBusiness,
  MdSearch
} from "react-icons/md";

import {
  FaUsers,
  FaWalking,
  FaAngleDown,
  FaAngleRight,
  FaUserTie
} from "react-icons/fa";

import {
  MdLocationOn,
  MdWarning,
  MdLocalFireDepartment,
  MdOutlineMap
} from "react-icons/md";

import { BiGitBranch } from "react-icons/bi";
import {
  RiAdminFill,
  RiFolderFill,
  RiStarFill
} from "react-icons/ri";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Side.css";

function Sidebar() {
  const [masterOpen, setMasterOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    if (
      location.pathname.includes("/designation") ||
      location.pathname.includes("/branch") ||
      location.pathname.includes("/department") ||
      location.pathname.includes("/roles")
    ) {
      setMasterOpen(true);
    }
  }, [location]);

  // 🔍 MENU CONFIG (IMPORTANT)
  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard />, path: "/home" },
    { label: "User", icon: <FaUsers />, path: "/users" },
    { label: "TBT", icon: <MdAssignment />, path: "/tbt" },
    { label: "Line Walk", icon: <FaWalking />, path: "/linewalk" },
    { label: "Near Miss", icon: <MdReportProblem />, path: "/nearmiss" }
  ];

  const masterItems = [
    { label: "Designation", icon: <FaUserTie />, path: "/designation" },
    { label: "Branch", icon: <BiGitBranch />, path: "/branch" },
    { label: "Department", icon: <MdBusiness />, path: "/department" },
    { label: "Roles", icon: <RiAdminFill />, path: "/roles" },
    { label: "Sections", icon: <RiFolderFill />, path: "/sections" },
    { label: "Item of Interest", icon: <RiStarFill />, path: "/item-of-interest" },
    { label: "Place of Incident", icon: <MdLocalFireDepartment />, path: "/places" },
    { label: "Location", icon: <MdLocationOn />, path: "/locations" },
    { label: "Area", icon: <MdOutlineMap />, path: "/area" },
    { label: "Possible Consequence", icon: <MdWarning />, path: "/possible-consequences" }
  ];

  // 🔍 FILTER LOGIC
  const filteredMenu = useMemo(() => {
    return menuItems.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredMaster = useMemo(() => {
    return masterItems.filter(item =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <aside id="sidebar">

      {/* HEADER */}
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <MdLocalShipping className="icon_header" />
          EXIM LOGISTICS
        </div>
      </div>

      {/* 🔍 SEARCH BAR */}
      <div className="sidebar-search">
        <MdSearch />
        <input
          type="text"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="sidebar-list">

        {/* MAIN MENU */}
        {filteredMenu.map((item, index) => (
          <li key={index} className="sidebar-list-item">
            <NavLink to={item.path} className={({ isActive }) => isActive ? "active-link" : ""}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}

        {/* MASTER MENU */}
        {(filteredMaster.length > 0 || search === "") && (
          <li className="sidebar-list-item">

            <div
              className="master-toggle"
              onClick={() => setMasterOpen(!masterOpen)}
            >
              <span>
                <MdSettingsApplications className="icon" /> Master
              </span>
              {masterOpen ? <FaAngleDown /> : <FaAngleRight />}
            </div>

            <div className={`submenu ${masterOpen ? "open" : ""}`}>
              {filteredMaster.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => isActive ? "active-link" : ""}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>

          </li>
        )}

        {/* SETTINGS */}
        <li className="sidebar-list-item">
          <NavLink to="/setting" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdSettings className="icon" /> Setting
          </NavLink>
        </li>

        {/* LOGOUT */}
        <li className="sidebar-list-item logout" onClick={handleLogout}>
          <MdLogout className="icon" /> Logout
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;