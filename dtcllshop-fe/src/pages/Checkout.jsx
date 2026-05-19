import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

const calculateSummary = (items) => {
  if (!Array.isArray(items)) {
    return { subtotal: 0, discount: 0, shippingFee: 0, total: 0 };
  }

  const selectedItems = items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((s, i) => s + (i.subtotal || 0), 0);
  const discount = 0;
  const shippingFee = subtotal > 0 ? 30000 : 0;
  const total = subtotal - discount + shippingFee;

  return { subtotal, discount, shippingFee, total };
};

const getCartProductId = (item) => Number(
    item?.productId ?? item?.product?.productId ?? item?.product?.id ?? 0
);

const getDirectProductId = (item) => Number(item?.productId ?? item?.id ?? 0);

const getProductPrice = (item) => Number(
    item?.costPrice ?? item?.price ?? item?.unitPrice ?? item?.priceAtTime ?? 0
);

const getCartItemPrice = (item) => Number(
    item?.priceAtTime ??
    item?.unitPrice ??
    item?.costPrice ??
    item?.price ??
    item?.product?.costPrice ??
    item?.product?.price ??
    0
);

const normalizeCartItem = (item) => {
  const quantity = Number(item.quantity ?? 1);
  const priceAtTime = getCartItemPrice(item);

  return {
    ...item,
    productId: getCartProductId(item),
    productName: item.productName ?? item.product?.productName ?? item.product?.name ?? item.name ?? "",
    selected: item.selected ?? item.isSelected ?? false,
    quantity,
    subtotal: Number(item.subtotal ?? priceAtTime * quantity),
    priceAtTime,
  };
};

const getCartDetailId = (item) => Number(
    item?.id ?? item?.cartDetailId ?? item?.cart_detail_id ?? 0
);

const deletePurchasedCartItems = async (items, token) => {
  for (const item of items) {
    const cartDetailId = getCartDetailId(item);

    if (!cartDetailId) {
      continue;
    }

    const res = await fetch(`http://localhost:8080/cart-details/delete/${cartDetailId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok && res.status !== 404) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Xóa sản phẩm đã mua khỏi giỏ hàng thất bại");
    }
  }
};

const getAddressNote = (addr) => {
  return addr?.deliveryNote || addr?.delivery_note || "";
};

const getFullAddress = (addr) => {
  const address = addr?.deliveryAddress || addr?.delivery_address || "";
  const province = addr?.province || "";
  return [address, province].filter(Boolean).join(", ");
};

const getAddressList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  return [];
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId || localStorage.getItem("userId");
  const accountId = location.state?.userId || localStorage.getItem("accountId") || localStorage.getItem("userId");
  const product = location.state?.product || null;
  const quantity = location.state?.quantity || 1;
  const selectedCartItems = Array.isArray(location.state?.select)
      ? location.state.select
      : null;
  const [checkoutItems, setCheckoutItems] = useState(
      selectedCartItems ? selectedCartItems.map(normalizeCartItem) : []
  );

  const [addresses, setAddresses] = useState([]);
  const [payment, setPayment] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [isAddAddress, setIsAddAddress] = useState(false);

  const [summary, setSummary] = useState({
    subtotal: 0,
    discount: 0,
    shippingFee: 0,
    total: 0,
  });

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    note: "",
  });

  const [formAddress, setFormAddress] = useState({
    delivery_address: "",
    delivery_note: "",
  });

  const fetchAddresses = async () => {
    try {
      if (!accountId) return;

      const token = localStorage.getItem("accessToken");

      const res = await fetch(`http://localhost:8080/addresses/${accountId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => []);
      console.log("ADDRESS API:", data);

      setAddresses(getAddressList(data));
    } catch (error) {
      console.log("Lỗi fetch Addresses:", error);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [accountId]);

  useEffect(() => {
    const handleFetchCustomer = async () => {
      try {
        if (!userId) return;

        const token = localStorage.getItem("accessToken");

        const res = await fetch(`http://localhost:8080/customers/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const customer = await res.json();

        setForm((prev) => ({
          ...prev,
          name: customer.fullName || customer.full_name || "",
          phone: customer.phoneNumber || customer.phone_number || "",
          email: customer.email || "",
        }));
      } catch (error) {
        console.log("Lỗi fetch customer:", error);
      }
    };

    handleFetchCustomer();
  }, [userId]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/v2/?depth=2")
        .then((res) => res.json())
        .then((data) => setProvinces(Array.isArray(data) ? data : []))
        .catch(() => setProvinces([]));
  }, []);

  useEffect(() => {
    if (selectedCartItems?.length > 0) {
      const normalizedItems = selectedCartItems.map(normalizeCartItem);
      setCheckoutItems(normalizedItems);
      setSummary(calculateSummary(normalizedItems));
      return;
    }

    const stored = localStorage.getItem("cartItems");

    if (stored) {
      try {
        const parsed = JSON.parse(stored).map(normalizeCartItem);
        const selectedItems = parsed.filter((item) => item.selected);
        setCheckoutItems(selectedItems);
        setSummary(calculateSummary(selectedItems));
      } catch (e) {
        console.log("Cart parse error:", e);
      }
    }
  }, [selectedCartItems]);

  const handleProvinceChange = (provinceName) => {
    setSelectedProvince(provinceName);
    const province = provinces.find((p) => p.name === provinceName);
    setWards(province?.wards || []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleChangeAddress = (e) => {
    setFormAddress({ ...formAddress, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (index) => {
    if (index === "") return;

    const addr = addresses[index];
    if (!addr) return;

    const addressText =
      addr?.deliveryAddress ||
      addr?.delivery_address ||
      addr?.address ||
      addr?.receiverAddress ||
      "";

    const provinceText = addr?.province || "";

    setForm((prev) => ({
      ...prev,
      address: addressText,
      province: provinceText,
      district: "",
      ward: "",
      note: getAddressNote(addr),
    }));
  };

  const handleAddNewAddress = async () => {
    try {
      if (!selectedProvince) {
        toast.warning("Vui lòng chọn tỉnh/thành!");
        return;
      }

      if (!formAddress.delivery_address?.trim()) {
        toast.warning("Vui lòng nhập địa chỉ giao hàng!");
        return;
      }

      const token = localStorage.getItem("accessToken");

      const finalDeliveryAddress = [
        formAddress.delivery_address.trim(),
        selectedWard,
      ]
        .filter(Boolean)
        .join(", ");

      const requestBody = {
        accountId: Number(accountId),
        province: selectedProvince,
        delivery_address: finalDeliveryAddress,
        delivery_note: formAddress.delivery_note,
      };

      const res = await fetch(`http://localhost:8080/addresses/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("ADD ADDRESS ERROR:", err);
        toast.error(err.message || "Thêm địa chỉ thất bại!");
        return;
      }

      await res.json().catch(() => null);
      toast.success("Thêm địa chỉ thành công!");

      await fetchAddresses();

      setForm((prev) => ({
        ...prev,
        address: finalDeliveryAddress,
        province: selectedProvince,
        district: "",
        ward: "",
        note: formAddress.delivery_note || "",
      }));

      setIsAddAddress(false);
      setSelectedProvince("");
      setSelectedWard("");
      setWards([]);
      setFormAddress({
        delivery_address: "",
        delivery_note: "",
      });
    } catch (error) {
      console.error("Không thể thêm địa chỉ mới!", error);
      toast.error("Không thể thêm địa chỉ mới!");
    }
  };

  const handleConfirm = async () => {
    try {
      if (payment === "") {
        toast.warning("Vui lòng chọn phương thức thanh toán!!!");
        return;
      }

      if (!form.address && !form.province) {
        toast.warning("Vui lòng chọn địa chỉ giao hàng!");
        return;
      }

      if (!product && checkoutItems.length === 0) {
        toast.warning("Vui lòng chọn sản phẩm muốn thanh toán!");
        return;
      }

      if (product && !getDirectProductId(product)) {
        toast.error("Thiếu mã sản phẩm. Vui lòng chọn lại sản phẩm.");
        return;
      }

      if (!product) {
        const invalidItem = checkoutItems.find((item) => !getCartProductId(item));

        if (invalidItem) {
          toast.error("Cart data is outdated. Please open the cart again.");
          navigate("/cart");
          return;
        }
      }

      const token = localStorage.getItem("accessToken");

      const items = product
        ? [{ productId: getDirectProductId(product), quantity: Number(quantity) }]
        : checkoutItems.map(item => ({
            productId: getCartProductId(item),
            quantity: Number(item.quantity || 1)
          }));

      const requestBody = {
        accountId: Number(userId),
        receiverName: form.name,
        receiverPhone: form.phone,
        receiverEmail: form.email,
        receiverAddress: [form.address, form.province].filter(Boolean).join(", "),
        note: form.note || "",
        paymentMethod: payment === "bank" ? "BANK_TRANSFER" : "CASH",
        items: items
      };

      const res = await fetch("http://localhost:8080/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.log("CHECKOUT ERROR:", err);
        throw new Error(err.message || "Tạo đơn hàng thất bại");
      }

      const checkoutResponse = await res.json();

      if (!product) {
        try {
          await deletePurchasedCartItems(checkoutItems, token);
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (cleanupError) {
          console.log("CART CLEANUP ERROR:", cleanupError);
        }
        localStorage.removeItem("cartItems");
      }

      toast.success("Đặt hàng thành công!");

      if (payment === "bank") {
        navigate(
          `/payment?orderId=${checkoutResponse.orderId}&amount=${checkoutResponse.totalAmount}&invoiceId=${checkoutResponse.invoiceId}&invoiceCode=${checkoutResponse.invoiceCode}`
        );
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Đặt hàng thất bại: " + error.message);
    }
  };

  return (
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h1 className="text-3xl font-bold mb-5">Thông tin giao hàng</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                  type="email"
                  name="email"
                  placeholder="Thư điện tử"
                  className="border p-3 rounded"
                  onChange={handleChange}
                  value={form.email}
              />

              <input
                  type="text"
                  name="name"
                  placeholder="Họ tên"
                  className="border p-3 rounded"
                  onChange={handleChange}
                  value={form.name}
              />

              <input
                  type="text"
                  name="phone"
                  placeholder="Số điện thoại"
                  className="border p-3 rounded"
                  onChange={handleChange}
                  value={form.phone}
              />

              <div className="p-3 relative">
                {!isAddAddress && (
                    <button
                        onClick={() => setIsAddAddress(true)}
                        className="absolute right-0 bottom-0 px-4 bg-black text-white py-2 rounded font-bold text-sm hover:bg-gray-800 transition"
                    >
                      Thêm địa chỉ mới
                    </button>
                )}
              </div>

              {!isAddAddress ? (
                  <select
                      name="address"
                      className="border p-3 rounded md:col-span-2"
                      onChange={(e) => handleSelectAddress(e.target.value)}
                  >
                    <option value="">-- Chọn địa chỉ đã lưu --</option>

                    {addresses.map((addr, index) => (
                      <option key={addr.id || addr.addressId || index} value={index}>
                        {getFullAddress(addr)}
                      </option>
                    ))}
                  </select>
              ) : (
                  <div className="md:col-span-2 border p-5 rounded bg-gray-100 space-y-4">
                    <h3 className="text-xl font-bold">Thêm địa chỉ mới</h3>

                    <input
                        type="text"
                        name="delivery_address"
                        placeholder="Địa chỉ giao hàng"
                        className="border p-3 rounded w-full"
                        onChange={handleChangeAddress}
                        value={formAddress.delivery_address}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                          value={selectedProvince}
                          onChange={(e) => handleProvinceChange(e.target.value)}
                          className="border p-2 rounded"
                      >
                        <option value="">-- Chọn tỉnh/thành --</option>

                        {provinces.map((p) => (
                            <option key={p.code} value={p.name}>
                              {p.name}
                            </option>
                        ))}
                      </select>

                      <select
                          className="border p-2 rounded"
                          disabled={!selectedProvince}
                          onChange={(e) => setSelectedWard(e.target.value)}
                          value={selectedWard}
                      >
                        <option value="">-- Chọn phường/xã --</option>

                        {wards.map((w) => (
                            <option key={w.code} value={w.name}>
                              {w.name}
                            </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                        name="delivery_note"
                        placeholder="Ghi chú giao hàng (không bắt buộc)"
                        className="border p-3 rounded w-full"
                        rows="3"
                        onChange={handleChangeAddress}
                        value={formAddress.delivery_note}
                    />

                    <div className="flex justify-between pt-2">
                      <button
                          onClick={() => setIsAddAddress(false)}
                          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Hủy
                      </button>

                      <button
                          onClick={handleAddNewAddress}
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                      >
                        Lưu địa chỉ
                      </button>
                    </div>
                  </div>
              )}

              <textarea
                  name="note"
                  placeholder="Ghi chú (không bắt buộc)"
                  className="border p-3 rounded md:col-span-2"
                  onChange={handleChange}
                  value={form.note}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Phương thức giao hàng</h2>
            <div className="border p-4 rounded flex justify-between items-center">
              <span>Tiêu chuẩn (3-5 ngày làm việc)</span>
              <span className="font-semibold">{formatVND(30000)}</span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Phương thức thanh toán</h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                <input
                    type="radio"
                    name="payment"
                    value="cash"
                    onChange={(e) => setPayment(e.target.value)}
                />
                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                <input
                    type="radio"
                    name="payment"
                    value="bank"
                    onChange={(e) => setPayment(e.target.value)}
                />
                <span>Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-red-500 p-6 rounded-lg bg-gray-50 shadow-md h-fit">
          <h2 className="text-3xl font-bold mb-6 text-red-500">Tóm tắt đơn hàng</h2>

          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span className="font-semibold">
              {formatVND(
                  product ? getProductPrice(product) * Number(quantity) : summary.subtotal
              )}
            </span>
            </div>

            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{formatVND(product ? 30000 : summary.shippingFee)}</span>
            </div>

            <div className="flex justify-between">
              <span>Giảm giá:</span>
              <span>{formatVND(summary.discount)}</span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold border-t pt-5 mt-5">
            <span>Tổng cộng:</span>
            <span className="text-red-500">
            {formatVND(
                product ? getProductPrice(product) * Number(quantity) + 30000 : summary.total
            )}
          </span>
          </div>

          <button
              onClick={handleConfirm}
              className="w-full mt-8 bg-black text-white py-3 rounded font-bold text-lg hover:bg-gray-800 transition"
          >
            Xác nhận đặt hàng
          </button>
        </div>
      </div>
  );
};

export default Checkout;




