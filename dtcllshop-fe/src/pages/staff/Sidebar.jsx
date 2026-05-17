import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBox, FaFileInvoice, FaSignOutAlt } from "react-icons/fa";

export default function StaffSidebar() {
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-sidebar fixed left-0 top-0 w-64 h-screen p-6 flex flex-col z-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="admin-sidebar-title">
          DTCLL Staff
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {/* Order Link */}
        <Link
          to="/staff/orders"
          className={`admin-sidebar-link flex items-center gap-3 px-4 py-3 transition ${
            isActive("/staff/orders")
              ? "is-active"
              : ""
          }`}
        >
          <FaBox size={18} />
          <span>Đơn hàng</span>
        </Link>
        
        {/* Invoice Link */}
        <Link
          to="/staff/invoices"
          className={`admin-sidebar-link flex items-center gap-3 px-4 py-3 transition ${
            isActive("/staff/invoices")
              ? "is-active"
              : ""
          }`}
        >
          <FaFileInvoice size={18} />
          <span>Hóa đơn</span>
        </Link>
      </nav>

      {/* Đăng xuất */}
      <button
        onClick={handleLogout}
        className="admin-sidebar-logout flex items-center gap-3 w-full px-4 py-3 transition"
      >
        <FaSignOutAlt size={18} />
        <span>Đăng xuất</span>
      </button>
    </div>
  );
}




