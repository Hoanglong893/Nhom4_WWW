// File: src/pages/Profile.jsx

import { useState, useEffect } from "react";
import { toast } from "sonner";
import ChatBot from "../components/ChatBot";
import  Contact  from "../components/Contact";

const API_BASE = "http://localhost:8080";

// --- API CLIENT ---
const api = {
    async get(url) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Network error");

        return data?.result ?? data;
    },

    async put(url, body) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
        return data?.result ?? data;
    },

    async post(url, body) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Tạo mới thất bại");
        return data?.result ?? data;
    },

    // Hàm delete cho API client
    async delete(url) {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        // Chỉ kiểm tra res.ok cho DELETE
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Xóa thất bại");
        }
        return true;
    },
};

// --- UTILS ---
const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isProfileChanged = (profile, initialProfile) => {
    if (!profile || !initialProfile) return false;
    return (
        profile.fullName !== initialProfile.fullName ||
        profile.phoneNumber !== initialProfile.phoneNumber ||
        profile.gender !== initialProfile.gender ||
        formatDateForInput(profile.dateOfBirth) !==
        formatDateForInput(initialProfile.dateOfBirth)
    );
};

// --- PROVINCES HOOK ---
const useProvinces = () => {
    const [provinces, setProvinces] = useState([]);
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/v2/?depth=2")
            .then(r => r.json())
            .then(d => setProvinces(Array.isArray(d) ? d : []))
            .catch(() => setProvinces([]));
    }, []);
    return provinces;
};

// --- FORM THÊM ĐỊA CHỈ MỚI (có dropdown tỉnh/phường) ---
const AddForm = ({ form, onChange, onProvinceChange, onSubmit, isLoading }) => {
    const provinces = useProvinces();
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState("");

    const handleProvinceChange = (e) => {
        const name = e.target.value;
        onProvinceChange(name);
        setSelectedWard("");
        const found = provinces.find(p => p.name === name);
        setWards(found?.wards || []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Nếu chọn phường/xã, tự động ghép vào delivery_address
        if (selectedWard && !form.delivery_address.includes(selectedWard)) {
            onChange({ target: { name: "delivery_address", value: form.delivery_address + `, ${selectedWard}` } });
        }
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 bg-red-50 rounded-lg p-4 space-y-3">
            <h4 className="font-bold text-red-700">Thêm địa chỉ mới</h4>
            <input
                name="delivery_address"
                value={form.delivery_address}
                onChange={onChange}
                placeholder="Số nhà, tên đường..."
                required
                className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={form.province}
                    onChange={handleProvinceChange}
                    required
                    className="p-2 border border-gray-300 rounded"
                >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {provinces.map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={!form.province || wards.length === 0}
                    className="p-2 border border-gray-300 rounded disabled:bg-gray-100"
                >
                    <option value="">-- Phường/Xã (tuỳ chọn) --</option>
                    {wards.map(w => (
                        <option key={w.code} value={w.name}>{w.name}</option>
                    ))}
                </select>
            </div>
            <input
                name="delivery_note"
                value={form.delivery_note}
                onChange={onChange}
                placeholder="Ghi chú giao hàng (không bắt buộc)"
                className="w-full p-2 border border-gray-300 rounded"
            />
            <button type="submit" disabled={isLoading}
                className="w-full bg-red-600 text-white p-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50">
                {isLoading ? "Đang lưu..." : "Lưu địa chỉ"}
            </button>
        </form>
    );
};

// --- FORM SỬA ĐỊA CHỈ (có dropdown tỉnh/phường) ---
const EditForm = ({ form, onChange, onProvinceChange, onSubmit, onCancel, isLoading }) => {
    const provinces = useProvinces();
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (form.province && provinces.length > 0) {
            const found = provinces.find(p => p.name === form.province);
            setWards(found?.wards || []);
        }
    }, [form.province, provinces]);

    const handleProvinceChange = (e) => {
        const name = e.target.value;
        onProvinceChange(name);
        const found = provinces.find(p => p.name === name);
        setWards(found?.wards || []);
    };

    return (
        <form onSubmit={onSubmit} className="bg-red-100 rounded-lg p-4 border-2 border-red-500 space-y-2">
            <h4 className="font-bold text-red-700">Sửa địa chỉ</h4>
            <input
                name="delivery_address"
                value={form.delivery_address}
                onChange={onChange}
                placeholder="Số nhà, tên đường..."
                required
                className="w-full p-2 border border-red-300 rounded"
            />
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={form.province}
                    onChange={handleProvinceChange}
                    required
                    className="p-2 border border-red-300 rounded"
                >
                    <option value="">-- Chọn tỉnh/thành --</option>
                    {provinces.map(p => (
                        <option key={p.code} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <select
                    disabled={wards.length === 0}
                    className="p-2 border border-red-300 rounded disabled:bg-gray-100"
                    onChange={(e) => {
                        const w = e.target.value;
                        if (w && !form.delivery_address.includes(w)) {
                            onChange({ target: { name: "delivery_address", value: form.delivery_address + `, ${w}` } });
                        }
                    }}
                >
                    <option value="">-- Phường/Xã (tuỳ chọn) --</option>
                    {wards.map(w => (
                        <option key={w.code} value={w.name}>{w.name}</option>
                    ))}
                </select>
            </div>
            <input
                name="delivery_note"
                value={form.delivery_note}
                onChange={onChange}
                placeholder="Ghi chú giao hàng..."
                className="w-full p-2 border border-red-300 rounded"
            />
            <div className="flex gap-2 pt-1">
                <button type="submit" disabled={isLoading}
                    className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50">
                    {isLoading ? "Đang cập nhật..." : "Lưu thay đổi"}
                </button>
                <button type="button" onClick={onCancel}
                    className="bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
                    Hủy
                </button>
            </div>
        </form>
    );
};

const getFullAddress = (addr) => {
  const address = addr?.delivery_address || addr?.deliveryAddress || "";
  const province = addr?.province || "";
  return [address, province].filter(Boolean).join(", ");
};

// --- ADDRESS SECTION ---
const AddressSection = ({ accountId, isCustomerProfile }) => {
    const [addresses, setAddresses] = useState([]);
    const [addressLoading, setAddressLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [editingAddress, setEditingAddress] = useState(null);

    const [editForm, setEditForm] = useState({
        id: null,
        delivery_address: "",
        province: "",
        delivery_note: "",
        accountId: accountId
    });

    const [currentActionId, setCurrentActionId] = useState(null);

    const [newAddress, setNewAddress] = useState({
        delivery_address: "",
        delivery_note: "",
        province: "",
        accountId: accountId,
    });

    const fetchAddresses = async () => {
        if (!accountId || accountId <= 0) return;

        setAddressLoading(true);
        try {
            const data = await api.get(`/addresses/${accountId}`);
            const list = Array.isArray(data) ? data : [];

            setAddresses(list);
        } catch {
            toast.error("Không thể tải địa chỉ");
            setAddresses([]);
        } finally {
            setAddressLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [accountId]);

    const handleNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStartEdit = (address) => {
        setShowAddForm(false);

        setEditingAddress(address.id);
        setCurrentActionId(null); // FIX: Ensure currentActionId is null when starting edit

        setEditForm({
            id: address.id,
            delivery_address: address.delivery_address || "",
            province: address.province || "",
            delivery_note: address.delivery_note || "",
            accountId: accountId
        });
    };

    const handleCancelEdit = () => {
        setEditingAddress(null);
        setEditForm({
            id: null,
            delivery_address: "",
            province: "",
            delivery_note: "",
            accountId: accountId
        });
        setCurrentActionId(null);
    };

    const handleEditAddress = async (e) => {
        e.preventDefault();

        if (!editForm.id) return;

        if (!editForm.delivery_address.trim() || !editForm.province.trim()) {
            toast.error("Vui lòng nhập địa chỉ và tỉnh/thành phố.");
            return;
        }

        setCurrentActionId(editForm.id);

        try {
            const payload = {
            ...editForm,
            delivery_address: editForm.delivery_address.trim(),
            province: editForm.province.trim(),
            accountId: accountId,
            };

            await api.put("/addresses/update", payload);
            toast.success("Cập nhật địa chỉ thành công!");

            handleCancelEdit();
            await fetchAddresses();
        } catch (error) {
            console.error("Lỗi khi cập nhật địa chỉ:", error);
            toast.error("Cập nhật địa chỉ thất bại: " + (error.message || "Lỗi không xác định"));
        } finally {
            setCurrentActionId(null);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        if (!newAddress.delivery_address.trim() || !newAddress.province.trim()) {
            toast.error("Vui lòng nhập địa chỉ và tỉnh/thành phố.");
            return;
        }

        setCurrentActionId("ADD_NEW");

        try {
            const payload = {
            ...newAddress,
            delivery_address: newAddress.delivery_address.trim(),
            province: newAddress.province.trim(),
            accountId: accountId,
            };

            await api.post("/addresses/add", payload);
            toast.success("Đã thêm địa chỉ!");

            setShowAddForm(false);
            setNewAddress({
            delivery_address: "",
            delivery_note: "",
            province: "",
            accountId,
            });

            await fetchAddresses();
        } catch {
            toast.error("Không thể thêm địa chỉ");
        } finally {
            setCurrentActionId(null);
        }
    };

    const handleDeleteAddress = async (id) => {
        // BƯỚC FIX: Ép kiểu ID thành số nguyên rõ ràng
        const addressId = parseInt(id, 10);

        if (isNaN(addressId) || addressId <= 0) {
            toast.error("Lỗi: ID địa chỉ không hợp lệ.");
            console.error("Attempted to delete address with invalid ID:", id);
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này không?")) return;

        // SỬ DỤNG addressId đã được xác thực
        setCurrentActionId(addressId);
        try {
            // DÙNG addressId (số nguyên) để gọi API
            await api.delete(`/addresses/${addressId}`);
            toast.success("Xóa địa chỉ thành công!");
            fetchAddresses();
        } catch (err) {
            // Lỗi từ Backend (ví dụ: "Address not found") sẽ được hiển thị
            toast.error(err.message);
        } finally {
            setCurrentActionId(null);
        }
    };
    const isAddressLoading = (id) => currentActionId === id;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Địa chỉ giao hàng</h2>

                {isCustomerProfile && (
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            handleCancelEdit();
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        {showAddForm ? "Hủy thêm" : "Thêm mới"}
                    </button>
                )}
            </div>

            {addressLoading && !editingAddress ? (
                <p className="text-center text-gray-500">Đang tải...</p>
            ) : addresses.length === 0 && !showAddForm ? (
                <p className="text-center text-gray-500 py-8">Chưa có địa chỉ đã lưu.</p>
            ) : (
                <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {addresses.map((addr) => (
                        <div key={addr.id}>
                            {editingAddress === addr.id ? (
                                // --- FORM EDIT ---
                                <EditForm
                                    form={editForm}
                                    onChange={handleEditFormChange}
                                    onProvinceChange={(val) => setEditForm(prev => ({ ...prev, province: val }))}
                                    onSubmit={handleEditAddress}
                                    onCancel={handleCancelEdit}
                                    isLoading={isAddressLoading(editForm.id)}
                                />
                            ) : (
                                // --- CARD ADDRESS ---
                                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md flex justify-between">
                                    <div>
                                        {/* BỔ SUNG: Hiển thị địa chỉ chi tiết */}
                                        <p>{getFullAddress(addr)}</p>

                                        <p className="text-sm text-gray-500 italic">
                                            Ghi chú: {addr.delivery_note || "Không có"}
                                        </p>
                                    </div>

                                    {isCustomerProfile && addr.id > 0 && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStartEdit(addr)}
                                                disabled={currentActionId !== null}
                                                className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                            >
                                                ✏️
                                            </button>

                                            <button
                                                onClick={() => handleDeleteAddress(addr.id)}
                                                disabled={currentActionId !== null}
                                                className="text-red-600 hover:bg-red-100 p-1 rounded"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ADD FORM */}
            {showAddForm && (
                <AddForm
                    form={newAddress}
                    onChange={handleNewAddressChange}
                    onProvinceChange={(val) => setNewAddress(prev => ({ ...prev, province: val }))}
                    onSubmit={handleAddAddress}
                    isLoading={isAddressLoading("ADD_NEW")}
                />
            )}
        </div>
    );
};

// --- PROFILE PAGE ---
const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [initialProfile, setInitialProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({}); // <--- THÊM: State để lưu lỗi

    const [formData, setFormData] = useState({
        id: null,
        accountId: null,
        fullName: "",
        phoneNumber: "",
        gender: "MALE",
        dateOfBirth: "",
    });

    const fetchProfile = async () => {
        setLoading(true);

        try {
            const customerData = await api.get("/customers/profile");

            if (!customerData) {
                throw new Error("Không tìm thấy hồ sơ khách hàng");
            }

            const newProfile = {
                id: customerData.id,
                accountId: customerData.accountId || null,
                fullName: customerData.fullName || "",
                phoneNumber: customerData.phoneNumber || "",
                email: customerData.email || "",
                gender: customerData.gender || "MALE",
                dateOfBirth: customerData.dateOfBirth || null,
            };

            setProfile(newProfile);
            setInitialProfile(newProfile);

            setFormData({
                id: newProfile.id,
                accountId: newProfile.accountId,
                fullName: newProfile.fullName,
                phoneNumber: newProfile.phoneNumber,
                email: newProfile.email,
                gender: newProfile.gender,
                dateOfBirth: formatDateForInput(newProfile.dateOfBirth),
            });

        } catch (err) {
            console.error("Lỗi khi tải hồ sơ:", err);
            toast.error("Không thể tải thông tin cá nhân. Vui lòng đăng nhập lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // --- VALIDATION LOGIC ---
    const NAME_REGEX = /^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/;
    // Regex cho SĐT VN: Bắt đầu bằng 0 hoặc +84, theo sau là 9-10 chữ số (vd: 0901234567 hoặc +84901234567)
    const PHONE_REGEX = /^(0|\+84)[3|5|7|8|9][0-9]{8,9}$/;

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // 1. Họ tên
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Vui lòng nhập họ tên.";
            isValid = false;
        } else if (!NAME_REGEX.test(formData.fullName)) {
            newErrors.fullName = "Họ tên chỉ được chứa chữ cái và khoảng trắng.";
            isValid = false;
        }

        // 2. Phone
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Vui lòng nhập số điện thoại.";
            isValid = false;
        } else if (!PHONE_REGEX.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (ví dụ: 0901234567 hoặc +84901234567).";
            isValid = false;
        }

        // 3. Date sinh
        if (formData.dateOfBirth) {
            const today = new Date().toISOString().split('T')[0];
            if (formData.dateOfBirth >= today) {
                newErrors.dateOfBirth = "Ngày sinh không được ở tương lai.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };
    // --- END VALIDATION LOGIC ---


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setProfile((prev) => ({ ...prev, [name]: value }));

        // Xóa lỗi khi người dùng bắt đầu gõ lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra Validation
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin đã nhập.");
            return;
        }

        if (!formData.id) {
            toast.error("Không xác định được mã khách hàng.");
            return;
        }

        setSaving(true);
        try {
            await api.put("/customers/update-profile", {
                id: formData.id,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth || null,
            });

            toast.success("Cập nhật hồ sơ thành công!");
            // Cập nhật lại initialProfile để reset trạng thái hasChanged
            await fetchProfile();
        } catch (err) {
            toast.error(err.message || "Cập nhật hồ sơ thất bại.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div></div>;

    const hasChanged = isProfileChanged(profile, initialProfile);

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gradient-to-br from-gray-50 to-red-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-black">
                        Hồ sơ của tôi
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
                        <div className="space-y-6">
                            {/* Tên đăng nhập / thư điện tử */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Tên đăng nhập / Thư điện tử</label>
                                <input
                                    value={profile.email}
                                    readOnly
                                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                                />
                            </div>

                            {/* Họ tên */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Họ tên</label>
                                <input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Nhập họ tên của bạn"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.fullName
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.fullName && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại của bạn"
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.phoneNumber
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.phoneNumber && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
                                )}
                            </div>

                            {/* Date sinh */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Ngày sinh</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${
                                        errors.dateOfBirth
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                                    }`}
                                />
                                {errors.dateOfBirth && ( // <-- HIỂN THỊ LỖI
                                    <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                                )}
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Giới tính</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                                >
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                    <option value="OTHER">Khác</option>
                                </select>
                            </div>

                            {/* Save Button */}
                            <button
                                disabled={!hasChanged || saving}
                                className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                            >
                                {saving ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                        </div>
                    </form>

                    <AddressSection
                        accountId={formData.accountId > 0 ? formData.accountId : parseInt(localStorage.getItem("accountId") || "0")}
                        isCustomerProfile={true}
                    />
                </div>
            </div>
            <ChatBot/>
            <Contact/>
        </div>
    );
};

export default Profile;




