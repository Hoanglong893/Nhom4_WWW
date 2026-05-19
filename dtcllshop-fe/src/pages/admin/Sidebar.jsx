import React from 'react';
// Tối ưu hóa layout và logic điều hướng cho Admin Dashboard
﻿import React from 'react';
import { BarChart3, Umbrella, Users, Package, Settings, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';
export default function Sidebar({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) {
  const navigate = useNavigate();
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} admin-sidebar transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && <h2 className="text-xl font-bold">Bảng Điều Khiển</h2>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded">
        {sidebarOpen && <h2 className="admin-sidebar-title">DTCLL Admin</h2>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-full hover:bg-white/10">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`admin-sidebar-link w-full flex items-center gap-3 px-4 py-3 transition ${
            activeTab === 'dashboard' ? 'is-active' : ''
          }`}
        >
          <BarChart3 size={20} />
          {sidebarOpen && <span>Tổng Quan</span>}
          {sidebarOpen && <span>Tổng quan</span>}
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`admin-sidebar-link w-full flex items-center gap-3 px-4 py-3 transition ${
            activeTab === 'customers' ? 'is-active' : ''
          }`}
        >
          <Users size={20} />
          {sidebarOpen && <span>Khách Hàng</span>}
          {sidebarOpen && <span>Khách hàng</span>}
        </button>

         <button
          onClick={() => setActiveTab('employees')}
          className={`admin-sidebar-link w-full flex items-center gap-3 px-4 py-3 transition ${
            activeTab === 'employees' ? 'is-active' : ''
          }`}
        >
          <Umbrella size={20} />
          {sidebarOpen && <span>Nhân Viên</span>}
          {sidebarOpen && <span>Nhân viên</span>}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`admin-sidebar-link w-full flex items-center gap-3 px-4 py-3 transition ${
            activeTab === 'products' ? 'is-active' : ''
          }`}
        >
          <Package size={20} />
          {sidebarOpen && <span>Sản Phẩm</span>}
          {sidebarOpen && <span>Sản phẩm</span>}
        </button>

        <button
          onClick={() => setActiveTab('productDashboard')}
          className={`admin-sidebar-link w-full flex items-center gap-3 px-4 py-3 transition ${
            activeTab === 'productDashboard' ? 'is-active' : ''
          }`}
        >
          <TrendingUp size={20} />
          {sidebarOpen && <span>Thống Kê Sản Phẩm</span>}
          {sidebarOpen && <span>Tổng quan sản phẩm</span>}
        </button>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="admin-sidebar-logout w-full flex items-center gap-3 px-4 py-3 transition mt-2"  
          onClick={()=>{
            localStorage.removeItem("accessToken")
            navigate("/login")}}
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Đăng Xuất</span>}
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}




