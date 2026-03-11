import React, { useState } from "react";
import { MdDashboard, MdAssignment, MdReportProblem, MdSettings, MdSettingsApplications } from "react-icons/md";
import { FaUsers, FaWalking } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import './Side.css'
function Sidebar() {

  const [masterOpen, setMasterOpen] = useState(false);

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
          <a href="/">
            <MdDashboard className="icon" /> Dashboard
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/users">
            <FaUsers className="icon" /> User
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/tbt">
            <MdAssignment className="icon" /> TBT
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/linewalk">
            <FaWalking className="icon" /> Line Walk
          </a>
        </li>

        <li className="sidebar-list-item">
          <a href="/nearmiss">
            <MdReportProblem className="icon" /> Near Miss
          </a>
        </li>


        {/* MASTER MENU */}

        <li className="sidebar-list-item">
          <div
            onClick={() => setMasterOpen(!masterOpen)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <span>
              <MdSettingsApplications className="icon" /> Master
            </span>

            {masterOpen ? <FaAngleDown /> : <FaAngleRight />}
          </div>

          {masterOpen && (
            <ul className="submenu">

              <li>
                <a href="/designation">Designation</a>
              </li>

              <li>
                <a href="/branch">Branch</a>
              </li>

              <li>
                <a href="/department">Department</a>
              </li>

            </ul>
          )}
        </li>


        <li className="sidebar-list-item">
          <a href="/setting">
            <MdSettings className="icon" /> Setting
          </a>
        </li>

      </ul>
    </aside>
  );
}

export default Sidebar;