import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdAssignment,
  MdReportProblem,
  MdSettings,
  MdSettingsApplications,
  MdLogout,
  MdLocalShipping,
  MdBusiness
} from "react-icons/md";

import {
  FaUsers,
  FaWalking,
  FaAngleDown,
  FaAngleRight,
  FaUserTie
} from "react-icons/fa";
import { MdPlace, MdLocationOn, MdWarning , MdLocalFireDepartment } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";
import { RiAdminFill, RiListUnordered, RiStarSmileFill, RiFolderFill, RiStarFill   } from "react-icons/ri";

import { NavLink, useNavigate, useLocation } from "react-router-dom";

import "./Side.css";

function Sidebar() {

  const [masterOpen, setMasterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Auto open master menu when inside master routes
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

  return (
    <aside id="sidebar">

      <div className="sidebar-title">
        <div className="sidebar-brand">
          <MdLocalShipping className="icon_header" /> EXIM LOGISTICS
        </div>
        <span className="icon close_icon">✕</span>
      </div>

      <ul className="sidebar-list">

        <li className="sidebar-list-item">
          <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdDashboard className="icon" /> Dashboard
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/users" className={({ isActive }) => isActive ? "active-link" : ""}>
            <FaUsers className="icon" /> User
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/tbt" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdAssignment className="icon" /> TBT
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/linewalk" className={({ isActive }) => isActive ? "active-link" : ""}>
            <FaWalking className="icon" /> Line Walk
          </NavLink>
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/nearmiss" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdReportProblem className="icon" /> Near Miss
          </NavLink>
        </li>

        {/* MASTER MENU */}

        <li className="sidebar-list-item">

          <div
            onClick={() => setMasterOpen(!masterOpen)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <span>
              <MdSettingsApplications className="icon" /> Master
            </span>

            {masterOpen ? <FaAngleDown /> : <FaAngleRight />}
          </div>

       {masterOpen && (
  <ul className="submenu">

    <li>
      <NavLink
        to="/designation"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <FaUserTie className="icon" /> Designation
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/branch"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <BiGitBranch className="icon" /> Branch
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/department"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <MdBusiness className="icon" /> Department
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/roles"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <RiAdminFill className="icon" /> Roles
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/sections"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <RiFolderFill className="icon" /> Sections
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/item-of-interest"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <RiStarFill className="icon" /> Item of Interest
      </NavLink>
    </li>

    {/* NEW ITEMS */}

  <li>
  <NavLink
    to="/places"
    className={({ isActive }) => isActive ? "active-link" : ""}
  >
    <MdLocalFireDepartment className="icon" /> Place of Incident
  </NavLink>
</li>

    <li>
      <NavLink
        to="/locations"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <MdLocationOn className="icon" /> Location
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/possible-consequences"
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        <MdWarning className="icon" /> Possible Consequence
      </NavLink>
    </li>

  </ul>
)}
        </li>

        <li className="sidebar-list-item">
          <NavLink to="/setting" className={({ isActive }) => isActive ? "active-link" : ""}>
            <MdSettings className="icon" /> Setting
          </NavLink>
        </li>

        {/* LOGOUT */}

        <li className="sidebar-list-item">
          <div
            onClick={handleLogout}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <MdLogout className="icon" /> Logout
          </div>
        </li>

      </ul>

    </aside>
  );
}

export default Sidebar;