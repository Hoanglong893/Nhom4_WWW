import React, { useState, useEffect } from "react";
import {
    FaEye,
    FaCheck,
    FaSync,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { orderStatusLabel, paymentMethodLabel } from "../../utils/vietnameseLabels";
export default function Order() {
    const navigate = useNavigate();
    const [orders, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [sortBy, setSortBy] = useState("date-desc");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/orders");
            if (!res.ok) {
                alert("Không thể tải danh sách đơn hàng");
                return;
            }
            const data = await res.json();
            setOrder(Array.isArray(data) ? data : data?.result || []);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
            alert("Lỗi khi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const filteredOrders = orders
        .filter((order) => {
            const matchSearch =
                order.id.toString().includes(searchTerm) ||
                (order.orderCode &&
                    order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (order.customerTrading?.receiverName &&
                    order.customerTrading.receiverName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (order.customerTrading?.receiverPhone &&
                    order.customerTrading.receiverPhone.includes(searchTerm));

            const matchStatus =
                statusFilter === "all" || order.statusOrder === statusFilter;

            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "date-desc":
                    return (
                        new Date(b.orderDate || b.createdAt) -
                        new Date(a.orderDate || a.createdAt)
                    );
                case "date-asc":
                    return (
                        new Date(a.orderDate || a.createdAt) -
                        new Date(b.orderDate || b.createdAt)
                    );
                case "price-desc":
                    return (
                        (b.customerTrading?.totalAmount || 0) -
                        (a.customerTrading?.totalAmount || 0)
                    );
                case "price-asc":
                    return (
                        (a.customerTrading?.totalAmount || 0) -
                        (b.customerTrading?.totalAmount || 0)
                    );
                default:
                    return 0;
            }
        });

    const handleXemDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const handleCreateInvoice = async (orderId) => {
        const token = localStorage.getItem("accessToken");

        const res = await fetch("http://localhost:8080/invoices", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                orderId: orderId,
                paymentMethod: "CASH",
                paymentStatus: "UNPAID",
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Không thể tạo hóa đơn");
        }

        return await res.json();
    };

    const handleConfirmOrder = async (orderId) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) {
            alert("Không tìm thấy đơn hàng!");
            return;
        }

        const isCashPayment = order.paymentMethod === "CASH";

        const confirmMessage = isCashPayment
            ? "Xác nhận đơn hàng này?"
            : "Xác nhận đơn hàng này?";

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            // 1) Cập nhật trạng thái đơn hàng
            const statusRes = await fetch(
                `http://localhost:8080/orders/status/${orderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ statusOrder: "CONFIRMED" }),
                }
            );

            if (!statusRes.ok) {
                const error = await statusRes.json().catch(() => ({}));
                throw new Error(error.message || "Không thể xác nhận đơn hàng");
            }

            // 2) Gửi thư điện tử thông báo cho khách hàng
            try {
                await fetch(
                    `http://localhost:8080/customers/email/notification/${order.account.id}/${orderId}`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // toast.info("Đã gửi thư điện tử thông báo cho khách hàng.");
            } catch (emailErr) {
                console.error("Gửi thư điện tử thất bại:", emailErr);
                // toast.warning("Đơn hàng đã xác nhận, nhưng gửi thư điện tử thất bại.");
            }

            // 3) Nếu thanh toán tiền mặt thì tạo hóa đơn
            if (isCashPayment) {
                try {
                    await handleCreateInvoice(orderId);
                    toast.success(
                        "Xác nhận đơn hàng thành công! Hóa đơn đã được tạo."
                    );
                } catch (invoiceError) {
                    console.error("Tạo hóa đơn thất bại:", invoiceError);
                    toast.warning(
                        "Xác nhận đơn hàng thành công!\nKhông thể tạo hóa đơn. Vui lòng tạo thủ công."
                    );
                }
            } else {
                toast.success("Xác nhận đơn hàng thành công!");
            }

            loadOrders();
            setShowDetailModal(false);
        } catch (error) {
            console.error("Lỗi xác nhận đơn hàng:", error);
            alert("Lỗi: " + (error.message || "Đã có lỗi xảy ra"));
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border border-yellow-300";
            case "CONFIRMED":
                return "bg-green-100 text-green-800 border border-green-300";
            case "SHIPPED":
                return "bg-purple-100 text-purple-800 border border-purple-300";
            case "DELIVERED":
                return "bg-emerald-100 text-emerald-800 border border-emerald-300";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border border-gray-300";
        }
    };

    const getSortIcon = (type) => {
        if (sortBy === `${type}-desc`) return <FaSortDown />;
        if (sortBy === `${type}-asc`) return <FaSortUp />;
        return <FaSort />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Quản lý đơn hàng
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Quản lý và theo dõi đơn hàng của khách
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/product")}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold"
                            >
                                <FaPlus />
                                <span>Tạo đơn hàng</span>
                            </button>
                            <button
                                onClick={loadOrders}
                                className="px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2 shadow-sm"
                            >
                                <FaSync className={loading ? "animate-spin" : ""} />
                                <span className="text-sm font-medium">Làm mới</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tìm kiếm đơn hàng
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="ID, mã đơn, tên, số điện thoại..."
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Lọc theo trạng thái
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium"
                            >
                                <option value="all">Tất cả đơn hàng</option>
                                <option value="PENDING">🟡 Chờ xác nhận</option>
                                <option value="CONFIRMED">🟢 Đã xác nhận</option>
                                <option value="CANCELLED">🔴 Đã hủy</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sắp xếp theo
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-base font-medium"
                            >
                                <option value="date-desc">📅 Mới nhất trước</option>
                                <option value="date-asc">📅 Cũ nhất trước</option>
                                <option value="price-desc">💰 Tổng tiền cao nhất</option>
                                <option value="price-asc">💰 Tổng tiền thấp nhất</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
                    </div>
                )}

                {!loading && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-500 text-xl font-medium">
                                    Không tìm thấy đơn hàng
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Thử thay đổi bộ lọc
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-white sticky top-0 z-10">
                                        <tr>
                                            <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                                                ID ĐƠN
                                            </th>
                                            <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                                                MÃ ĐƠN
                                            </th>
                                            <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                                                <div className="flex items-center gap-2">
                                                    NGÀY {getSortIcon("date")}
                                                </div>
                                            </th>
                                            <th className="px-12 py-5 text-left text-base font-bold tracking-wide">
                                                KHÁCH HÀNG
                                            </th>
                                            <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                                                <div className="flex items-center gap-2">
                                                    TỔNG TIỀN {getSortIcon("price")}
                                                </div>
                                            </th>
                                            <th className="px-6 py-5 text-left text-base font-bold tracking-wide">
                                                TRẠNG THÁI
                                            </th>
                                            <th className="px-6 py-5 text-center text-base font-bold tracking-wide">
                                                THAO TÁC
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-5 text-base font-bold text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-5 text-base font-semibold text-gray-700">
                                                    {order.orderCode || "Chưa có"}
                                                </td>
                                                <td className="px-6 py-5 text-base text-gray-700">
                                                    {formatDate(order.orderDate || order.createdAt)}
                                                </td>
                                                <td className="px-6 py-5 text-base">
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-base">
                                                            {order.customerTrading?.receiverName || "Chưa có"}
                                                        </p>
                                                        <p className="text-sm text-gray-600 font-medium mt-0.5">
                                                            📞 {order.customerTrading?.receiverPhone || "Chưa có"}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-base font-bold text-red-600">
                                                    {formatPrice(order.customerTrading?.totalAmount || 0)}
                                                </td>
                                                <td className="px-6 py-5 text-base">
                                                    <span
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${getStatusColor(
                                                            order.statusOrder
                                                        )}`}
                                                    >
                                                        {orderStatusLabel(order.statusOrder)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleXemDetails(order)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition-all shadow-sm text-sm"
                                                        >
                                                            <FaEye size={16} />
                                                            <span>Xem</span>
                                                        </button>

                                                        {order.statusOrder === "PENDING" && (
                                                            <button
                                                                onClick={() => handleConfirmOrder(order.id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition-all shadow-sm text-sm"
                                                            >
                                                                <FaCheck size={16} />
                                                                <span>Xác nhận</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && filteredOrders.length > 0 && (
                            <div className="bg-gray-50 px-6 py-4 border-t-2 border-gray-200">
                                <p className="text-base text-gray-700 font-semibold">
                                    Đang hiển thị {filteredOrders.length} đơn hàng
                                    {statusFilter !== "all" && ` (${orderStatusLabel(statusFilter)})`}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 flex justify-between items-center rounded-t-xl z-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Chi tiết đơn hàng</h2>
                                <p className="text-gray-300 text-sm mt-1">
                                    Thông tin đầy đủ của đơn hàng
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-white hover:text-gray-300 text-4xl font-bold transition-colors leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    📋 Thông tin đơn hàng
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            ID đơn hàng
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            #{selectedOrder.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Mã đơn hàng
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {selectedOrder.orderCode || "Chưa có"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Ngày đặt hàng
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatDate(
                                                selectedOrder.orderDate || selectedOrder.createdAt
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Trạng thái
                                        </p>
                                        <span
                                            className={`text-sm font-bold px-4 py-2 rounded-lg inline-block ${getStatusColor(
                                                selectedOrder.statusOrder
                                            )}`}
                                        >
                                            {orderStatusLabel(selectedOrder.statusOrder)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Phương thức thanh toán
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {paymentMethodLabel(selectedOrder.paymentMethod)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Tổng tiền
                                        </p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {formatPrice(
                                                selectedOrder.customerTrading?.totalAmount || 0
                                            )}
                                        </p>
                                    </div>
                                    {selectedOrder.note && (
                                        <div className="col-span-3">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">
                                                Ghi chú
                                            </p>
                                            <p className="text-base text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                💡 {selectedOrder.note}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    📦 Thông tin người nhận
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Tên người nhận
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {selectedOrder.customerTrading?.receiverName || "Chưa có"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Số điện thoại
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            📞 {selectedOrder.customerTrading?.receiverPhone || "Chưa có"}
                                        </p>
                                    </div>
                                    {selectedOrder.customerTrading?.receiverEmail && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600 font-semibold mb-1">
                                                Thư điện tử
                                            </p>
                                            <p className="text-base text-gray-900">
                                                ✉️ {selectedOrder.customerTrading.receiverEmail}
                                            </p>
                                        </div>
                                    )}
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600 font-semibold mb-1">
                                            Địa chỉ giao hàng
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 bg-white p-3 rounded-lg border border-blue-300">
                                            📍{" "}
                                            {selectedOrder.customerTrading?.receiverAddress || "Chưa có"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedOrder.account && (
                                <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        👤 Người đặt hàng
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold mb-1">
                                                Tên đăng nhập
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {selectedOrder.account.username || "Chưa có"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold mb-1">
                                                Họ tên
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {selectedOrder.account.customer?.fullName || "Chưa có"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 font-semibold mb-1">
                                                Số điện thoại
                                            </p>
                                            <p className="text-lg font-bold text-gray-900">
                                                📞{" "}
                                                {selectedOrder.account.customer?.phoneNumber || "Chưa có"}
                                            </p>
                                        </div>
                                        {selectedOrder.account.customer?.email && (
                                            <div className="col-span-3">
                                                <p className="text-sm text-gray-600 font-semibold mb-1">
                                                    Thư điện tử
                                                </p>
                                                <p className="text-base text-gray-900">
                                                    ✉️ {selectedOrder.account.customer.email}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedOrder.orderDetails &&
                                selectedOrder.orderDetails.length > 0 && (
                                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            🛍️ Sản phẩm trong đơn ({selectedOrder.orderDetails.length})
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-800 text-white">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-bold">
                                                            #
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-bold">
                                                            Tên sản phẩm
                                                        </th>
                                                        <th className="px-4 py-3 text-center text-sm font-bold">
                                                            Số lượng
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-sm font-bold">
                                                            Đơn giá
                                                        </th>
                                                        <th className="px-4 py-3 text-right text-sm font-bold">
                                                            Thành tiền
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {selectedOrder.orderDetails.map((item, idx) => (
                                                        <tr
                                                            key={idx}
                                                            className="bg-white hover:bg-gray-50 transition-colors"
                                                        >
                                                            <td className="px-4 py-4 text-sm font-bold text-gray-900">
                                                                {idx + 1}
                                                            </td>
                                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                                                {item.productName || "Sản phẩm không xác định"}
                                                            </td>
                                                            <td className="px-4 py-4 text-center text-sm font-bold text-gray-900">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
                                                                {formatPrice(item.unitPrice || 0)}
                                                            </td>
                                                            <td className="px-4 py-4 text-right text-base font-bold text-red-600">
                                                                {formatPrice(item.totalPrice || 0)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-100">
                                                    <tr>
                                                        <td
                                                            colSpan="4"
                                                            className="px-4 py-4 text-right text-base font-bold text-gray-900"
                                                        >
                                                            Tổng cộng:
                                                        </td>
                                                        <td className="px-4 py-4 text-right text-xl font-bold text-red-600">
                                                            {formatPrice(
                                                                selectedOrder.customerTrading?.totalAmount || 0
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-100 px-8 py-5 border-t-2 border-gray-300 flex justify-end gap-4 rounded-b-xl">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="px-8 py-3 text-gray-700 hover:text-gray-900 font-bold border-2 border-gray-400 rounded-lg hover:bg-gray-200 transition-all text-base"
                            >
                                Đóng
                            </button>
                            {selectedOrder.statusOrder === "PENDING" && (
                                <button
                                    onClick={() => {
                                        handleConfirmOrder(selectedOrder.id);
                                    }}
                                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold flex items-center gap-2 transition-all shadow-lg text-base"
                                >
                                    <FaCheck size={18} />
                                    Xác nhận đơn hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}










