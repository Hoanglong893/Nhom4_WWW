import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, ShoppingCart, Users, Package, Download, Filter, TrendingUp, TrendingDown, Clock, MapPin, CreditCard } from 'lucide-react';

const Dashboard = () => {
  const token = localStorage.getItem("accessToken");

  const [paymentData, setPaymentData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [timeSlotData, setTimeSlotData] = useState([]);
  const [allData, setAllData] = useState([]);

  // -------------------------
  // 1. DATE RANGE
  // -------------------------
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
  });

  // -------------------------
  // 2. API: STATISTICS DAILY
  // -------------------------
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/orders/daily?start=${dateRange.start}&end=${dateRange.end}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        setAllData(data || []);
      } catch (e) {
        console.error("Error fetching daily stats:", e);
      }
    };

    fetchStats();
  }, [dateRange]);

  // -------------------------
  // 3. OTHER APIs
  // -------------------------
  const fetchTimeSlotData = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/time-slots", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeSlotData(await res.json());
    } catch (err) {
      console.error("Error fetching time slots:", err);
    }
  };

  const fetchDetailedOrders = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/detailed-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetailedOrders(await res.json());
    } catch (err) {
      console.error("Error fetching detailed orders:", err);
    }
  };

  const fetchRegionData = async () => {
    try {
      const res = await fetch("http://localhost:8080/customer-trading/regions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegionData(await res.json());
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const res = await fetch("http://localhost:8080/invoices/payment", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPaymentData(await res.json());
    } catch (err) {
      console.error("Error fetching payment data:", err);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchRegionData();
    fetchDetailedOrders();
    fetchTimeSlotData();
  }, []);

  // -------------------------
  // 4. DATA NORMALIZATION (FILL MISSING DATES)
  // -------------------------
  const getDateList = (start, end) => {
    const list = [];
    let cur = new Date(start);
    const last = new Date(end);

    while (cur <= last) {
      list.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return list;
  };

  const chartData = useMemo(() => {
    const dateList = getDateList(dateRange.start, dateRange.end);

    return dateList.map(d => {
      const found = allData.find(item => item.date === d);
      return (
        found || {
          date: d,
          revenue: 0,
          orders: 0,
          customers: 0,
          products: 0
        }
      );
    });
  }, [allData, dateRange]);

  // -------------------------
  // 5. TOTALS CALCULATION
  // -------------------------
  const totalRevenue = chartData.reduce((s, i) => s + i.revenue, 0);
  const totalOrders = chartData.reduce((s, i) => s + i.orders, 0);
  const totalCustomers = chartData.reduce((s, i) => s + i.customers, 0);
  const totalProducts = chartData.reduce((s, i) => s + i.products, 0);

  // -------------------------
  // 6. GROWTH CALCULATION (VS PREVIOUS PERIOD)
  // -------------------------
  const getPrevRange = () => {
    const days = chartData.length;
    const end = new Date(dateRange.start);
    end.setDate(end.getDate() - 1);

    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0]
    };
  };

  const prevRange = getPrevRange();
  const prevData = allData.filter(
    d => d.date >= prevRange.start && d.date <= prevRange.end
  );

  const prevRevenue = prevData.reduce((s, i) => s + i.revenue, 0);
  const prevOrders = prevData.reduce((s, i) => s + i.orders, 0);

  const revenueGrowth =
    prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  const ordersGrowth =
    prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;

  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  // -------------------------
  // 7. FORMAT CURRENCY (VIETNAMESE DONG in EN LOCALE)
  // -------------------------
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US").format(value) + " VND";
  };

  // -------------------------
  // 8. QUICK RANGE
  // -------------------------
  const setQuickRange = type => {
    const today = new Date();
    let start = new Date();

    switch (type) {
      case "today":
        break;
      case "yesterday":
        start = new Date(today.setDate(today.getDate() - 1));
        break;
      case "7days":
        start = new Date(today.setDate(today.getDate() - 7));
        break;
      case "30days":
        start = new Date(today.setDate(today.getDate() - 30));
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "thisYear":
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        break;
    }

    setDateRange({
      start: start.toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0]
    });
  };

  // -------------------------
  // 9. EXPORT CSV
  // -------------------------
  const exportToCSV = () => {
    const headers = ["Date", "Revenue", "Orders", "Customers", "Products"];

    // 1. LỌC DỮ LIỆU: Chỉ lấy những ngày có doanh thu hoặc đơn hàng > 0
    const activeData = chartData.filter(item => item.orders > 0 || item.revenue > 0);

    // 2. FORMAT LẠI DATA
    const rows = activeData.map(i => {
      // Chuyển đổi format date từ YYYY-MM-DD sang DD/MM/YYYY để Excel dễ đọc
      // Giả sử i.date đang là "2024-12-05"
      const [year, month, day] = i.date.split("-");
      const formattedDate = `${day}/${month}/${year}`; 

      return [
        `"${formattedDate}"`, // Thêm ngoặc kép để Excel hiểu là text, tránh lỗi ####### hoặc tự tính toán
        i.revenue,
        i.orders,
        i.customers,
        i.products
      ];
    });

    // Nếu không có dữ liệu nào thì thông báo (tùy chọn)
    if (rows.length === 0) {
      alert("Không có dữ liệu phát sinh trong khoảng thời gian này để xuất file.");
      return;
    }

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Revenue_Report_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
  };

  // Helper to translate status from Backend (Vietnamese) to Frontend (English)
  const getStatusLabel = (status) => {
    switch (status) {
        case 'Hoàn thành': return 'Hoàn thành';
        case 'Đang giao': return 'Đang giao';
        case 'Đang xử lý': return 'Đang xử lý';
        case 'Hủy': return 'Đã hủy';
        default: return status;
    }
  };

  // Helper to translate payment from Backend (Vietnamese) to Frontend (English)
  const getPaymentLabel = (payment) => {
    switch (payment) {
        case 'Thẻ tín dụng': return 'Thẻ tín dụng';
        case 'Banking': return 'Chuyển khoản';
        default: return payment;
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with gradient */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <DollarSign className="w-8 h-8" />
                </div>
                Bảng Điều Khiển Doanh Thu
              </h1>
              <p className="text-indigo-100 text-lg">Quản lý và phân tích hiệu suất kinh doanh</p>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm mb-1">Cập nhật lần cuối</p>
              <p className="text-xl font-semibold">{new Date().toLocaleTimeString('vi-VN')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Modern Date Range Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Bộ lọc Ngày</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: 'Hôm nay', action: 'today' },
              { label: 'Hôm qua', action: 'yesterday' },
              { label: '7 Ngày qua', action: '7days' },
              { label: '30 Ngày qua', action: '30days' },
              { label: 'Tháng này', action: 'thisMonth' },
              { label: 'Năm nay', action: 'thisYear' }
            ].map((btn) => (
              <button
                key={btn.action}
                onClick={() => setQuickRange(btn.action)}
                className="px-4 py-3 bg-linear-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-xl font-medium transition-all transform hover:scale-105 border border-blue-200 shadow-sm"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Từ Ngày</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Đến Ngày</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Modern KPI Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="group bg-linear-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition">
                <DollarSign className="w-7 h-7" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${revenueGrowth >= 0 ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                {revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(revenueGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-2">Tổng Doanh Thu</p>
            <p className="text-3xl font-bold mb-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-blue-200 text-xs">so với kỳ trước</p>
          </div>

          <div className="group bg-linear-to-br from-emerald-500 via-green-600 to-teal-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${ordersGrowth >= 0 ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                {ordersGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(ordersGrowth).toFixed(1)}%
              </div>
            </div>
            <p className="text-green-100 text-sm font-medium mb-2">Tổng Đơn Hàng</p>
            <p className="text-3xl font-bold mb-1">{totalOrders.toLocaleString()}</p>
            <p className="text-green-200 text-xs">Đơn hàng trong kỳ</p>
          </div>

          <div className="group bg-linear-to-br from-purple-500 via-violet-600 to-purple-700 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition">
                <Users className="w-7 h-7" />
              </div>
              <div className="bg-purple-400/30 px-3 py-1 rounded-full text-xs font-bold">
                Hoạt động
              </div>
            </div>
            <p className="text-purple-100 text-sm font-medium mb-2">Khách Hàng</p>
            <p className="text-3xl font-bold mb-1">{totalCustomers.toLocaleString()}</p>
            <p className="text-purple-200 text-xs">Khách hàng hoạt động</p>
          </div>

          <div className="group bg-linear-to-br from-amber-500 via-orange-600 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition">
                <Package className="w-7 h-7" />
              </div>
              <div className="bg-orange-400/30 px-3 py-1 rounded-full text-xs font-bold">
                TB: {formatCurrency(avgOrderValue)}
              </div>
            </div>
            <p className="text-orange-100 text-sm font-medium mb-2">Sản Phẩm Đã Bán</p>
            <p className="text-3xl font-bold mb-1">{totalProducts.toLocaleString()}</p>
            <p className="text-orange-200 text-xs">Giá trị Đơn trung bình</p>
          </div>
        </div>

        {/* Area Chart - Revenue Trend */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">📊 Xu Hướng Doanh Thu</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm">Doanh thu</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">Đơn hàng</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="displayDate" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" strokeWidth={3} />
              <Area type="monotone" dataKey="orders" stroke="#10b981" fillOpacity={1} fill="url(#colorOrders)" name="Đơn hàng" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment & Time Slot Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Methods */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-pink-600" />
              <h2 className="text-xl font-bold text-gray-800">💳 Phương Thức Thanh Toán</h2>
            </div>
            <div className="space-y-4">
              {paymentData.map((payment, idx) => {
                const percent = (payment.value);
                // Simple assumption to map common Vietnamese terms if they come from backend, otherwise display as is
                const displayName = getPaymentLabel(payment.name);

                return (
                  <div key={idx} className="group hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payment.color }}></div>
                        <span className="font-semibold text-gray-700">{displayName}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{payment.value}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          background: `linear-gradient(90deg, ${payment.color}, ${payment.color}dd)`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{payment.orders.toLocaleString()} đơn hàng</span>
                      <span className="font-semibold">{formatCurrency(payment.revenue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">⏰ Khung Giờ Mua Sắm Cao Điểm</h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={timeSlotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Performance */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">🗺️ Doanh Thu theo Khu Vực</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {regionData.map((region, idx) => (
              <div key={idx} className="group p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-lg transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-800">{region.name}</h3>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${region.growth >= 10 ? 'bg-green-100 text-green-700' : region.growth >= 5 ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                    +{region.growth}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-indigo-600 mb-1">{formatCurrency(region.revenue)}</p>
                <p className="text-sm text-gray-600">{region.orders.toLocaleString()} đơn hàng</p>
              </div>
            ))}
          </div>
        </div>
        {/* Detailed Orders Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">📋 Danh Sách Đơn Hàng Chi Tiết</h2>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-5 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Xuất CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-indigo-100">
                  <th className="text-left py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Mã Đơn Hàng</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Khách Hàng</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Tổng Cộng</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Thanh Toán</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Trạng Thái</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Ngày đặt</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-700 bg-linear-to-r from-indigo-50 to-purple-50">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {detailedOrders.map((order, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-indigo-600 group-hover:text-indigo-700">{order.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-gray-700 font-medium">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-lg text-indigo-600">{formatCurrency(order.total)}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${order.payment === 'Momo' ? 'bg-pink-100 text-pink-700' :
                        order.payment === 'Banking' ? 'bg-blue-100 text-blue-700' :
                          order.payment === 'COD' ? 'bg-green-100 text-green-700' :
                            'bg-orange-100 text-orange-700'
                        }`}>
                        {order.payment === 'Momo' && '📱'}
                        {order.payment === 'Banking' && '🏦'}
                        {order.payment === 'COD' && '💵'}
                        {order.payment === 'Thẻ tín dụng' && '💳'}
                        {getPaymentLabel(order.payment)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                        order.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status === 'Hoàn thành' && '✓'}
                        {order.status === 'Đang giao' && '🚚'}
                        {order.status === 'Đang xử lý' && '⏳'}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-gray-600 text-sm">{order.date}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                        {order.items}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">Hiển thị <span className="font-bold text-gray-800">1-{detailedOrders.length}</span> trên <span className="font-bold text-gray-800">{totalOrders}</span> tổng đơn hàng</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">Trước</button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">1</button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">2</button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">3</button>
              <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition">Tiếp</button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pb-8 text-center">
          <p className="text-gray-500 text-sm">© 2024 Bảng điều khiển doanh thu - Phát triển bởi Nhóm 4</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
