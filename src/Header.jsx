import React from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';

function Header({ OpenSidebar }) {
  return (
    <>
      <header className="header">
        <div className="header-left">
     
          <span className="header-brand">Incident Management System</span>
        </div>

        <div className="header-right">
          <BsFillBellFill className="icon" title="Notifications" />
          <BsFillEnvelopeFill className="icon" title="Messages" />
          <BsPersonCircle className="icon" title="Profile" />
        </div>
      </header>

      <style>{`
        /* ==============================
           HEADER STYLING
        ============================== */
        .header {
          height: 60px;
          position: fixed;
          top: 0;
          left: 280px; /* matches sidebar width */
          right: 0;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          z-index: 999;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: left 0.3s ease;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-brand {
          font-weight: 700;
          font-size: 14px;
          color: #1e293b;
        }

        .menu-toggle {
          font-size: 24px;
          cursor: pointer;
          color: #1e293b;
          transition: transform 0.3s ease;
        }

        .menu-toggle:hover {
          transform: rotate(90deg);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 20px;
          color: #1e293b;
        }

        .header-right .icon {
          cursor: pointer;
          transition: color 0.3s ease, transform 0.2s ease;
        }

        .header-right .icon:hover {
          color: #3b82f6;
          transform: scale(1.1);
        }

        /* Responsive adjustments */
        @media screen and (max-width: 992px) {
          .header {
            left: 0;
          }
        }
      `}</style>
    </>
  );
}

export default Header;