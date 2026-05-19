import React from "react";
import StaffSidebar from "./Sidebar";
import "../../css/AdminTheme.css";

export default function StaffDashboard({ children }) {
  return (
    <div className="admin-theme staff-shell min-h-screen">
      <StaffSidebar />
      <div className="staff-workspace">
        <div className="admin-topbar">
          <div>
            <p className="admin-eyebrow">DTCLL OPERATIONS</p>
            <h1>Khu vực nhân viên</h1>
          </div>
          <div className="admin-topbar-meta">
            <span>STAFF</span>
            <strong>{new Date().toLocaleDateString("vi-VN")}</strong>
          </div>
        </div>

        <div className="admin-content-frame">{children}</div>
      </div>
    </div>
  );
}
