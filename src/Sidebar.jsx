import React from 'react';
import { BsCart3 } from 'react-icons/bs';
import { MdDashboard, MdAssignment, MdReportProblem, MdSettings, MdSettingsApplications } from 'react-icons/md';
import { FaUsers, FaWalking } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md'; 
function Sidebar() {
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

        <li className="sidebar-list-item">
          <a href="/master">
            <MdSettingsApplications className="icon" /> Master
          </a>
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