import { useState, useMemo, useEffect } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  MapPin,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

const Dashboard = () => {
  const token = localStorage.getItem("accessToken");

  const [paymentData, setPaymentData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [detailedOrder, setDetailedOrder] = useState([]);
  const [timeSlotData, setTimeSlotData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/orders/daily?start=${dateRange.start}&end=${dateRange.end}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setAllData(data || []);
      } catch (e) {
        console.error("Lỗi tải thống kê theo ngày:", e);
      }
    };

    fetchStats();
  }, [dateRange]);

  const fetchTimeSlotData = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/time-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeSlotData(await res.json());
    } catch (err) {
      console.error("Lỗi tải khung giờ:", err);
    }
  };

  const fetchDetailedOrder = async () => {
    try {
      const res = await fetch("http://localhost:8080/orders/detailed-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDetailedOrder(await res.json());
    } catch (err) {
      console.error("Lỗi tải chi tiết đơn hàng:", err);
    }
  };

  const fetchRegionData = async () => {
    try {
      const res = await fetch("http://localhost:8080/customer-trading/regions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegionData(await res.json());
    } catch (err) {
      console.error("Lỗi tải dữ liệu khu vực:", err);
    }
  };

  const fetchPaymentData = async () => {
    try {
      const res = await fetch("http://localhost:8080/invoices/payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentData(await res.json());
    } catch (err) {
      console.error("Lỗi tải dữ liệu thanh toán:", err);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchRegionData();
    fetchDetailedOrder();
    fetchTimeSlotData();
  }, []);

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

    return dateList.map((d) => {
      const found = allData.find((item) => item.date === d);
      const base = found || {
        date: d,
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0,
      };

      return {
        ...base,
        displayDate: new Date(d).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        }),
      };
    });
  }, [allData, dateRange]);

  const totalRevenue = chartData.reduce((s, i) => s + i.revenue, 0);
  const totalOrder = chartData.reduce((s, i) => s + i.orders, 0);
  const totalCustomers = chartData.reduce((s, i) => s + i.customers, 0);
  const totalProducts = chartData.reduce((s, i) => s + i.products, 0);

  const getTrướcRange = () => {
    const days = chartData.length;
    const end = new Date(dateRange.start);
    end.setDate(end.getDate() - 1);

    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  const prevRange = getTrướcRange();
  const prevData = allData.filter(
    (d) => d.date >= prevRange.start && d.date <= prevRange.end
  );

  const prevRevenue = prevData.reduce((s, i) => s + i.revenue, 0);
  const prevOrder = prevData.reduce((s, i) => s + i.orders, 0);

  const revenueGrowth =
    prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

  const ordersGrowth =
    prevOrder > 0 ? ((totalOrder - prevOrder) / prevOrder) * 100 : 0;

  const avgOrderValue = totalOrder ? totalRevenue / totalOrder : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " đ";
  };

  const setQuickRange = (type) => {
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
      end: new Date().toISOString().split("T")[0],
    });
  };

  const exportToCSV = () => {
    const headers = ["Ngày", "Doanh thu", "Đơn hàng", "Khách hàng", "Sản phẩm"];
    const activeData = chartData.filter((item) => item.orders > 0 || item.revenue > 0);

    const rows = activeData.map((i) => {
      const [year, month, day] = i.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      return [
        `"${formattedDate}"`,
        i.revenue,
        i.orders,
        i.customers,
        i.products,
      ];
    });

    if (rows.length === 0) {
      alert("Không có dữ liệu phát sinh trong khoảng thời gian này để xuất file.");
      return;
    }

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Revenue_Report_${dateRange.start}_${dateRange.end}.csv`;
    link.click();
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "Hoàn thành";
      case "Đang giao":
        return "Đang giao";
      case "Đang xử lý":
        return "Đang xử lý";
      case "Hủy":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentLabel = (payment) => {
    switch (payment) {
      case "Thẻ tín dụng":
        return "Thẻ tín dụng";
      case "Banking":
      case "BANKING":
      case "BANK_TRANSFER":
        return "Chuyển khoản ngân hàng";
      case "COD":
      case "CASH":
        return "Thanh toán khi nhận hàng";
      default:
        return payment;
    }
  };

  const quickRanges = [
    { label: "Hôm nay", action: "today" },
    { label: "Hôm qua", action: "yesterday" },
    { label: "7 ngày", action: "7days" },
    { label: "30 ngày", action: "30days" },
    { label: "Tháng này", action: "thisMonth" },
    { label: "Năm nay", action: "thisYear" },
  ];

  const kpiCards = [
    {
      icon: DollarSign,
      label: "Doanh thu",
      value: formatCurrency(totalRevenue),
      caption: "Tổng giá trị trong kỳ",
      trend: revenueGrowth,
    },
    {
      icon: ShoppingCart,
      label: "Đơn hàng",
      value: totalOrder.toLocaleString(),
      caption: "Số đơn đã ghi nhận",
      trend: ordersGrowth,
    },
    {
      icon: Users,
      label: "Khách hàng",
      value: totalCustomers.toLocaleString(),
      caption: "Khách hàng hoạt động",
      tag: "Hoạt động",
    },
    {
      icon: Package,
      label: "Sản phẩm",
      value: totalProducts.toLocaleString(),
      caption: `Giá trị TB: ${formatCurrency(avgOrderValue)}`,
      tag: "Kho",
    },
  ];

  return (
    <div className="dashboard-v2">
      <section className="dashboard-v2-hero">
        <div>
          <p className="dashboard-v2-eyebrow">Revenue Command</p>
          <h1>Bảng doanh thu</h1>
          <p>Quan sát doanh thu, đơn hàng, thanh toán và khu vực bán hàng trong một bố cục mới.</p>
        </div>

        <div className="dashboard-v2-heroStats">
          <span>Cập nhật</span>
          <strong>{new Date().toLocaleTimeString("vi-VN")}</strong>
          <small>{dateRange.start} - {dateRange.end}</small>
        </div>
      </section>

      <section className="dashboard-v2-layout">
        <aside className="dashboard-v2-panel">
          <div className="dashboard-v2-panelTitle">
            <Calendar size={20} />
            <div>
              <h2>Bộ lọc</h2>
              <p>Chọn khoảng thời gian</p>
            </div>
          </div>

          <div className="dashboard-v2-quick">
            {quickRanges.map((btn) => (
              <button key={btn.action} onClick={() => setQuickRange(btn.action)}>
                {btn.label}
              </button>
            ))}
          </div>

          <label>
            <span>Từ ngày</span>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </label>

          <label>
            <span>Đến ngày</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </label>

          <button className="dashboard-v2-export" onClick={exportToCSV}>
            <Download size={17} />
            Xuất CSV
          </button>
        </aside>

        <main className="dashboard-v2-main">
          <div className="dashboard-v2-kpis">
            {kpiCards.map((item) => (
              <article key={item.label} className="dashboard-v2-kpi">
                <div className="dashboard-v2-kpiTop">
                  <span className="dashboard-v2-kpiIcon">
                    <item.icon size={22} />
                  </span>
                  {"trend" in item ? (
                    <span className="dashboard-v2-trend">
                      {item.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.abs(item.trend).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="dashboard-v2-tag">{item.tag}</span>
                  )}
                </div>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
                <small>{item.caption}</small>
              </article>
            ))}
          </div>

          <section className="dashboard-v2-card dashboard-v2-chart">
            <div className="dashboard-v2-cardHeader">
              <div>
                <p className="dashboard-v2-eyebrow">Trend</p>
                <h2>Xu hướng doanh thu</h2>
              </div>
              <div className="dashboard-v2-tabs">
                <span>Doanh thu</span>
                <span>Đơn hàng</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={330}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#355946" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#355946" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dashboardOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9ff3d" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#c9ff3d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dfe5da" />
                <XAxis dataKey="displayDate" stroke="#5f665f" style={{ fontSize: "12px" }} />
                <YAxis stroke="#5f665f" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.96)",
                    border: "1px solid rgba(53,89,70,0.16)",
                    borderRadius: "12px",
                    boxShadow: "0 12px 28px rgba(53,89,70,0.12)",
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#355946"
                  fillOpacity={1}
                  fill="url(#dashboardRevenue)"
                  name="Doanh thu"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#93c01f"
                  fillOpacity={1}
                  fill="url(#dashboardOrders)"
                  name="Đơn hàng"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </section>

          <section className="dashboard-v2-split">
            <div className="dashboard-v2-card">
              <div className="dashboard-v2-cardHeader">
                <div>
                  <p className="dashboard-v2-eyebrow">Payment</p>
                  <h2>Phương thức thanh toán</h2>
                </div>
                <CreditCard size={22} />
              </div>

              <div className="dashboard-v2-paymentList">
                {paymentData.map((payment, idx) => (
                  <div key={idx} className="dashboard-v2-paymentItem">
                    <div>
                      <span style={{ backgroundColor: payment.color }} />
                      <strong>{getPaymentLabel(payment.name)}</strong>
                    </div>
                    <em>{payment.value}%</em>
                    <div className="dashboard-v2-progress">
                      <i style={{ width: `${payment.value}%` }} />
                    </div>
                    <small>
                      {payment.orders?.toLocaleString?.() || payment.orders} đơn - {formatCurrency(payment.revenue || 0)}
                    </small>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-v2-card">
              <div className="dashboard-v2-cardHeader">
                <div>
                  <p className="dashboard-v2-eyebrow">Peak Hours</p>
                  <h2>Giờ mua sắm cao điểm</h2>
                </div>
                <Clock size={22} />
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={timeSlotData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe5da" />
                  <XAxis dataKey="time" stroke="#5f665f" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#5f665f" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.96)",
                      border: "1px solid rgba(53,89,70,0.16)",
                      borderRadius: "12px",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Bar dataKey="revenue" fill="#355946" radius={[8, 8, 0, 0]} name="Doanh thu" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="dashboard-v2-card">
            <div className="dashboard-v2-cardHeader">
              <div>
                <p className="dashboard-v2-eyebrow">Regions</p>
                <h2>Doanh thu theo khu vực</h2>
              </div>
              <MapPin size={22} />
            </div>

            <div className="dashboard-v2-regions">
              {regionData.map((region, idx) => (
                <article key={idx}>
                  <div>
                    <strong>{region.name}</strong>
                    <span>+{region.growth}%</span>
                  </div>
                  <p>{formatCurrency(region.revenue)}</p>
                  <small>{region.orders?.toLocaleString?.() || region.orders} đơn hàng</small>
                </article>
              ))}
            </div>
          </section>

          <section className="dashboard-v2-card">
            <div className="dashboard-v2-cardHeader">
              <div>
                <p className="dashboard-v2-eyebrow">Orders</p>
                <h2>Chi tiết đơn hàng</h2>
              </div>
              <button className="dashboard-v2-export compact" onClick={exportToCSV}>
                <Download size={16} />
                Xuất CSV
              </button>
            </div>

            <div className="dashboard-v2-tableWrap">
              <table className="dashboard-v2-table">
                <thead>
                  <tr>
                    <th>ID đơn</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Thanh toán</th>
                    <th>Trạng thái</th>
                    <th>Ngày</th>
                    <th>Sản phẩm</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedOrder.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{order.id}</strong>
                      </td>
                      <td>{order.customer}</td>
                      <td>{formatCurrency(order.total)}</td>
                      <td>{getPaymentLabel(order.payment)}</td>
                      <td>
                        <span>{getStatusLabel(order.status)}</span>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="dashboard-v2-tableFooter">
              <span>Hiển thị {detailedOrder.length} / {totalOrder} đơn hàng</span>
              <div>
                <button>Trước</button>
                <button className="active">1</button>
                <button>2</button>
                <button>Sau</button>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;
