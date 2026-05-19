export const orderStatusLabel = (status) => {
  const labels = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    SHIPPED: "Đang giao hàng",
    DELIVERED: "Đã giao",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
  };

  return labels[status] || status || "Không xác định";
};

export const paymentStatusLabel = (status) => {
  const labels = {
    PAID: "Đã thanh toán",
    UNPAID: "Chưa thanh toán",
    PENDING: "Chờ thanh toán",
    FAILED: "Thanh toán thất bại",
  };

  return labels[status] || status || "Không xác định";
};

export const paymentMethodLabel = (method) => {
  const labels = {
    CASH: "Thanh toán khi nhận hàng",
    COD: "Thanh toán khi nhận hàng",
    BANK_TRANSFER: "Chuyển khoản ngân hàng",
    BANKING: "Chuyển khoản ngân hàng",
    CREDIT_CARD: "Thẻ tín dụng",
    DEBIT_CARD: "Thẻ ghi nợ",
    MOMO: "Ví MoMo",
    ZALOPAY: "ZaloPay",
    VNPAY: "VNPay",
  };

  return labels[method] || method || "Không xác định";
};

export const accountStatusLabel = (status) => {
  const labels = {
    ACTIVE: "Hoạt động",
    LOCKED: "Đã khóa",
    PENDING: "Chờ duyệt",
    INACTIVE: "Ngừng hoạt động",
  };

  return labels[status] || status || "Không xác định";
};

export const productStatusLabel = (status) => {
  const labels = {
    ACTIVE: "Đang bán",
    INACTIVE: "Ngừng bán",
    OUT_OF_STOCK: "Hết hàng",
  };

  return labels[status] || status || "Không xác định";
};

export const genderLabel = (gender) => {
  const labels = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };

  return labels[gender] || gender || "Không xác định";
};

export const roleLabel = (role) => {
  const labels = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    USER: "Khách hàng",
  };

  return labels[role] || role || "Không xác định";
};

export const categoryLabel = (category) => {
  const labels = {
    Top: "Áo",
    Bottom: "Quần",
    Accessories: "Phụ kiện",
  };

  return labels[category] || category || "Chưa phân loại";
};
