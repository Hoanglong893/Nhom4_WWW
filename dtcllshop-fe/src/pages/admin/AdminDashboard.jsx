import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Customers from './Customers';
import Products from './Products';
import Employees from './Employees';
import ProductDashboard from './ProductDashboard';
import AdminChatBot from '../../components/AdminChatBot';
import '../../css/AdminTheme.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

 const [initialProductFilter, setInitialProductFilter] = useState('ALL'); 

  // Hàm này nhận 'ALL' hoặc 'LOW_STOCK' từ ProductDashboard
  const handleNavigateToProducts = (filterType) => {
    setInitialProductFilter(filterType); 
    setActiveTab('products'); // Chuyển tab
  };
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <Customers />;
      case 'employees':
        return <Employees/>;
      case 'products':
        return <Products initialFilter={initialProductFilter}  />;
      case 'productDashboard':
        return <ProductDashboard onNavigate={handleNavigateToProducts}/>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-theme admin-shell flex h-screen">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="admin-workspace flex-1 overflow-auto">
        <div className="admin-topbar">
          <div>
            <p className="admin-eyebrow">DTCLL CONTROL CENTER</p>
            <h1>Không gian quản trị</h1>
          </div>
          <div className="admin-topbar-meta">
            <span>ADMIN</span>
            <strong>{new Date().toLocaleDateString("vi-VN")}</strong>
          </div>
        </div>

        <div className="admin-content-frame">
          {renderContent()}
        </div>
      </div>
      <AdminChatBot/>
    </div>
  );
}
