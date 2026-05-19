import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaPlus, FaTrash, FaEnvelope, FaStar, FaEye, FaMailBulk, FaBan } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const accountStatusText = (status) =>
  ({
    ACTIVE: "Hoạt động",
    LOCKED: "Đã khóa",
    INACTIVE: "Ngừng hoạt động",
  }[status] || status || "Không xác định");

const genderText = (gender) =>
  ({
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  }[gender] || gender || "Chưa có");

const roleText = (role) =>
  ({
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    USER: "Khách hàng",
  }[role] || role || "Chưa có");

export default function Employees() {
  const [accounts, setAccounts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "", ACTIVE, LOCKED
  const [openModal, setOpenModal] = useState(false);  // mở đóng modal tạo cuộc họp 
  // Create / Edit state
  const [showCreate, setShowCreate] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);


  const [form, setForm] = useState(
    {
      username: "",
      password: "",
      customer: {
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "",

        dateOfBirth: ""
      },
      role: "",
      statusLogin: ""
    }
  );

  // Loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  // Load customer list
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {

    setLoading(true);
    setError(null);
    try {

      // tạo query string
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (statusFilter) params.append("status", statusFilter);
      params.append("role", "STAFF")
      const res = await fetch(
        `http://localhost:8080/accounts?${params.toString()}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!res.ok) throw new Error("Tải danh sách tài khoản thất bại");
      const data = await res.json();

      setAccounts(data.result); // nếu response dạng ApiResponse
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (account) => {
    setSelectedCustomer(account.customer);
    setShowDetail(true);
  };

  const openCreate = () => {
    setEditingAccount(null);
    setForm({
      customer: {
        fullName: "",
        phoneNumber: "",
        email: "",
        gender: "MALE",
        dateOfBirth: ""
      },
      username: "",
      password: "",
      role: "STAFF",
      statusLogin: "ACTIVE",
    });
    setShowCreate(true);
  };

  const openEdit = (account) => {
    const rawDate = account.customer.dateOfBirth || "";
    const formattedDate = rawDate ? rawDate.slice(0, 10) : ""; // lấy yyyy-mm-dd

    setEditingAccount(account);
    setForm({
      customer: {
        fullName: account.customer.fullName || "",
        phoneNumber: account.customer.phoneNumber || "",
        email: account.customer.email || "",
        gender: account.customer.gender || "",
        dateOfBirth: formattedDate
      },
      username: account.username || "",
      password: "",
      role: account.role || "",
      statusLogin: account.statusLogin || "",
    });
    setShowCreate(true);
  };

  const handleChange = (path, value) => {
    setForm(prev => {
      const keys = path.split(".");
      const updated = { ...prev };

      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;

      return updated;
    });
  };

  const createCustomer = async () => {
    // Validate cơ bản
    if (!form.customer.fullName || !form.customer.email) {
      alert("Vui lòng nhập đầy đủ họ tên và thư điện tử");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/accounts/admin/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          customer: {
            fullName: form.customer.fullName,
            phoneNumber: form.customer.phoneNumber,
            email: form.customer.email,
            gender: form.customer.gender,
            dateOfBirth: form.customer.dateOfBirth, // yyyy-mm-dd
          },
          role: form.role,
          statusLogin: form.statusLogin
        })
      });

      if (!res.ok) throw new Error(`Tạo nhân viên thất bại: ${res.status}`);

      await loadCustomers();
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi tạo nhân viên");
    } finally {
      setLoading(false);
    }
  };


  const updateCustomer = async () => {
    if (!editingAccount) return;

    try {
      setLoading(true);

      const res = await fetch(`http://localhost:8080/accounts/admin/update/${editingAccount.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password || undefined, // nếu bỏ trống thì không gửi password
          customer: {
            fullName: form.customer.fullName,
            phoneNumber: form.customer.phoneNumber,
            email: form.customer.email,
            gender: form.customer.gender,
            dateOfBirth: form.customer.dateOfBirth, // yyyy-mm-dd
          },
          role: form.role,
          statusLogin: form.statusLogin
        })
      });

      if (!res.ok) throw new Error(`Cập nhật nhân viên thất bại: ${res.status}`);

      await loadCustomers();
      setShowCreate(false);
      setEditingAccount(null);

    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi cập nhật tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const blockAccount = async (account) => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8080/accounts/admin/delete/${account.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!res.ok) throw new Error(`Khóa tài khoản thất bại: ${res.status}`);

      await loadCustomers(); // <-- thêm để refresh UI
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi khóa tài khoản");
    } finally {
      setLoading(false);
    }
  };

  // handle creat meeting modal 
  const openCreateMeetingModal = () => {
    setOpenModal(true)
  }

  const MeetingSchema = Yup.object().shape({
    title: Yup.string().required("Tiêu đề không được để trống"),
    description: Yup.string().required("Mô tả không được để trống"),
    startTime: Yup.string().required("Vui lòng chọn thời gian bắt đầu"),
    endTime: Yup.string().required("Vui lòng chọn thời gian kết thúc"),
  });

  const handleCreateMeeting = async (meetingData) => {
    try {
      setLoading(true);

      // Payload gửi đi (gán attendees là mảng rỗng cho an toàn)

      console.log("Yêu cầu tạo cuộc họp:", meetingData);

      const res = await fetch("http://localhost:8080/accounts/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(
          meetingData
        )
      });

      if (res.ok) {
        // const data = await res.json(); // Có thể uncomment nếu cần dùng data
        alert("Tạo cuộc họp thành công!");
        setOpenModal(false);
      } else {
        const errorText = await res.text();
        throw new Error(`Lỗi ${res.status}: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Lỗi khi tạo cuộc họp");
    } finally {
      setLoading(false);
    }
  };


  const submitForm = () => {
    if (editingAccount) updateCustomer();
    else createCustomer();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <FaUser className="text-purple-600" /> Quản lý nhân viên
              </h1>
              <p className="text-gray-500 mt-1">Quản lý và theo dõi nhân viên</p>
            </div>

            <div className="flex gap-3">
              <button
                className="admin-btn-primary"
                onClick={openCreate}
              >
                <FaPlus /> Thêm nhân viên
              </button>

              <button className="admin-btn-secondary"
                onClick={() => openCreateMeetingModal()}
              >
                <FaMailBulk /> Tạo Google Meet
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-5">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search by name */}
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Tìm theo tên..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div className="w-full md:w-48">
              <select
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Đã khóa</option>
              </select>
            </div>

            {/* Filter button */}
            <button
              className="admin-btn-primary w-full md:w-auto"
              onClick={loadCustomers}
            >
              Lọc
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
              Đang tải...
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl shadow-sm">
            Lỗi: {error}
          </div>
        )}

        {/* Customer Table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Thư điện tử</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {accounts
                  .filter(c => c.id !== 1)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-purple-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{c.customer.fullName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FaEnvelope className="text-gray-400" />
                          {c.customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{c.customer.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className="admin-status-badge admin-status-info">
                          {roleText(c.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`admin-status-badge ${c.statusLogin === 'ACTIVE'
                          ? 'admin-status-success'
                          : 'admin-status-danger'
                          }`}>
                          {accountStatusText(c.statusLogin)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="admin-btn-secondary"
                            onClick={() => openDetail(c)}
                          >
                            <FaEye />
                            <span className="text-sm font-medium">Chi tiết</span>
                          </button>

                          <button
                            className="admin-btn-primary"
                            onClick={() => openEdit(c)}
                          >
                            <FaEdit />
                            <span className="text-sm font-medium">Cập nhật</span>
                          </button>

                          <button
                            className="admin-btn-danger"
                            onClick={() => blockAccount(c)}
                          >
                            <FaBan />
                            <span className="text-sm font-medium">Khóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {accounts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <FaUser className="mx-auto text-4xl mb-3 opacity-50" />
                        <p className="text-lg font-medium">Không tìm thấy nhân viên</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetail && selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl transform transition-all">

              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Chi tiết nhân viên</h2>
                    <p className="text-sm text-gray-500 mt-1">Thông tin đầy đủ của nhân viên</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    onClick={() => setShowDetail(false)}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              {/* 2 Columns */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Left Column — Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                      Thông tin nhân viên
                    </h3>

                    <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <strong className="text-gray-700 min-w-[120px]">Họ tên:</strong>
                        <span className="text-gray-900 font-medium">{selectedCustomer.fullName}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <strong className="text-gray-700 min-w-[120px]">Số điện thoại:</strong>
                        <span className="text-gray-900">{selectedCustomer.phoneNumber}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <strong className="text-gray-700 min-w-[120px]">Thư điện tử:</strong>
                        <span className="text-gray-900">{selectedCustomer.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <strong className="text-gray-700 min-w-[120px]">Giới tính:</strong>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                          {genderText(selectedCustomer.gender)}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <strong className="text-gray-700 min-w-[120px]">Ngày sinh:</strong>
                        <span className="text-gray-900">{selectedCustomer.dateOfBirth}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column — Order History (commented out in original) */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-green-500 to-emerald-500 rounded-full"></span>
                      Thông tin bổ sung
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-500 italic text-center py-8">Không có thông tin bổ sung</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Button */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-3xl">
                <button
                  className="admin-btn-secondary"
                  onClick={() => setShowDetail(false)}
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">

              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50 rounded-t-3xl sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingAccount ? "Sửa nhân viên" : "Tạo nhân viên mới"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {editingAccount ? "Cập nhật thông tin nhân viên" : "Nhập thông tin để tạo nhân viên mới"}
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    onClick={() => { setShowCreate(false); setEditingAccount(null); }}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Left Column */}
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-indigo-500 rounded-full"></span>
                      Thông tin nhân viên
                    </h3>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Họ tên</label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.customer.fullName}
                        onChange={e => handleChange("customer.fullName", e.target.value)}
                        placeholder="Nhập họ tên"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Thư điện tử</label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.customer.email}
                        onChange={e => handleChange("customer.email", e.target.value)}
                        placeholder="vidu@dtcllshop.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Số điện thoại</label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.customer.phoneNumber}
                        onChange={e => handleChange("customer.phoneNumber", e.target.value)}
                        placeholder="+84 xxx xxx xxx"
                      />
                    </div>

                    {/* GENDER */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Giới tính</label>
                      <select
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 bg-white"
                        value={form.customer.gender}
                        onChange={e => handleChange("customer.gender", e.target.value)}
                      >
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Ngày sinh</label>
                      <input
                        type="date"
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.customer.dateOfBirth}
                        onChange={e => handleChange("customer.dateOfBirth", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      <span className="w-1 h-6 bg-linear-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                      Thông tin tài khoản
                    </h3>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Tên đăng nhập</label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.username}
                        onChange={e => handleChange("username", e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Mật khẩu</label>
                      <input
                        type="password"
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={form.password}
                        onChange={e => handleChange("password", e.target.value)}
                        placeholder={editingAccount ? "Nhập mật khẩu mới..." : "Nhập mật khẩu"}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Vai trò</label>
                      <input
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                        value={roleText(form.role)}
                        onChange={e => handleChange("role", e.target.value)}
                        placeholder="Nhập vai trò"
                        disabled
                      />
                    </div>

                    {/* TRẠNG THÁI */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">Trạng thái</label>
                      <select
                        className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 bg-white"
                        value={form.statusLogin}
                        onChange={e => handleChange("statusLogin", e.target.value)}
                      >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="LOCKED">Đã khóa</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Buttons */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl">
                <button
                  className="admin-btn-secondary"
                  onClick={() => { setShowCreate(false); setEditingAccount(null); }}
                >
                  Hủy
                </button>

                <button
                  className="admin-btn-primary"
                  onClick={submitForm}
                >
                  {editingAccount ? "Lưu thay đổi" : "Tạo nhân viên"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Create Meeting Modal - No Attendees */}
        {openModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl transform transition-all">

              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-purple-50 to-indigo-50 rounded-t-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Tạo cuộc họp Google Meet
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Lên lịch cuộc họp trực tuyến
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                    onClick={() => setOpenModal(false)}
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>

              {/* Modal Body with Formik */}
              <Formik
                initialValues={{
                  title: "",
                  description: "",
                  startTime: "",
                  endTime: ""
                  // Bỏ initialValues của attendees
                }}
                validationSchema={MeetingSchema}
                onSubmit={(values) => {
                  // Gọi trực tiếp hàm xử lý
                  handleCreateMeeting(values);
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="flex flex-col h-full">
                    <div className="p-8 space-y-5">

                      {/* Title */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Tiêu đề cuộc họp
                        </label>
                        <Field
                          name="title"
                          type="text"
                          className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                          placeholder="Ví dụ: Họp triển khai dự án tháng 12"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-red-500 text-xs mt-1 font-medium pl-1"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Mô tả nội dung
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows="3"
                          className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200"
                          placeholder="Nhập nội dung chi tiết cuộc họp..."
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-500 text-xs mt-1 font-medium pl-1"
                        />
                      </div>

                      {/* Time Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Thời gian bắt đầu
                          </label>
                          <Field
                            name="startTime"
                            type="datetime-local"
                            className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-600"
                          />
                          <ErrorMessage
                            name="startTime"
                            component="div"
                            className="text-red-500 text-xs mt-1 font-medium pl-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Thời gian kết thúc
                          </label>
                          <Field
                            name="endTime"
                            type="datetime-local"
                            className="border-2 border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all duration-200 text-gray-600"
                          />
                          <ErrorMessage
                            name="endTime"
                            component="div"
                            className="text-red-500 text-xs mt-1 font-medium pl-1"
                          />
                        </div>
                      </div>

                      {/* Đã xóa phần input Attendees ở đây */}

                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl mt-auto">
                      <button
                        type="button"
                        onClick={() => setOpenModal(false)}
                        className="admin-btn-secondary"
                      >
                        Hủy bỏ
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="admin-btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Đang xử lý..." : "Tạo cuộc họp"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


