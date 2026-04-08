import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import {
  MdDashboard,
  MdAssignment,
  MdReportProblem,
  MdSettings,
  MdSettingsApplications,
  MdLogout,
  MdLocalShipping,
  MdBusiness,
  MdSearch,
  MdLocationOn,
  MdWarning,
  MdLocalFireDepartment,
  MdOutlineMap
} from "react-icons/md";

import { FaUsers, FaWalking, FaAngleDown, FaAngleRight, FaUserTie } from "react-icons/fa";
import { BiGitBranch } from "react-icons/bi";
import { RiAdminFill, RiFolderFill, RiStarFill } from "react-icons/ri";

import "./Side.css";

function Sidebar() {
  const [masterOpen, setMasterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔑 Read permissions from localStorage
  const permissions = JSON.parse(localStorage.getItem("permissions")) || {};

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

  // 🔍 MENU CONFIG (with permission keys)
  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard />, path: "/home", permission: null }, // everyone can see
    { label: "User", icon: <FaUsers />, path: "/users", permission: "is_admin" },
    { label: "TBT", icon: <MdAssignment />, path: "/tbt", permission: "is_tbt" },
    { label: "Line Walk", icon: <FaWalking />, path: "/linewalk", permission: "is_linewalk" },
    { label: "Near Miss", icon: <MdReportProblem />, path: "/nearmiss", permission: "is_nearmiss" }
  ];

  const masterItems = [
    { label: "Designation", icon: <FaUserTie />, path: "/designation", permission: "is_admin" },
    { label: "Branch", icon: <BiGitBranch />, path: "/branch", permission: "is_admin" },
    { label: "Department", icon: <MdBusiness />, path: "/department", permission: "is_admin" },
    { label: "Roles", icon: <RiAdminFill />, path: "/roles", permission: "is_admin" },
    { label: "Sections", icon: <RiFolderFill />, path: "/sections", permission: "is_admin" },
    { label: "Item of Interest", icon: <RiStarFill />, path: "/item-of-interest", permission: "is_admin" },
    { label: "Place of Incident", icon: <MdLocalFireDepartment />, path: "/places", permission: "is_admin" },
    { label: "Location", icon: <MdLocationOn />, path: "/locations", permission: "is_admin" },
    { label: "Area", icon: <MdOutlineMap />, path: "/area", permission: "is_admin" },
    { label: "Possible Consequence", icon: <MdWarning />, path: "/possible-consequences", permission: "is_admin" }
  ];

  // 🔍 FILTER LOGIC
  const filteredMenu = useMemo(() => {
    return menuItems
      .filter(item => !item.permission || permissions[item.permission] || permissions.is_admin)
      .filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, permissions]);

  const filteredMaster = useMemo(() => {
    return masterItems
      .filter(item => permissions[item.permission] || permissions.is_admin)
      .filter(item => item.label.toLowerCase().includes(search.toLowerCase()));
  }, [search, permissions]);

  return (
    <aside id="sidebar">
      {/* HEADER */}
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <MdLocalShipping className="icon_header" />
          EXIM LOGISTICS
        </div>
      </div>

      {/* SEARCH BAR */}
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
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}

        {/* MASTER MENU */}
        {filteredMaster.length > 0 && (
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
                  className={({ isActive }) => (isActive ? "active-link" : "")}
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
          <NavLink
            to="/setting"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
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