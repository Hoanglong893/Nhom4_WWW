import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Mail } from "lucide-react";

const getForgotPasswordError = (data) => {
    if (data?.message) {
        return data.message;
    }

    if (typeof data?.result === "string") {
        return data.result;
    }

    return "Không gửi được mã xác minh. Vui lòng thử lại sau!";
};

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        const normalizedEmail = email.trim();

        if (!normalizedEmail) {
            alert("Vui lòng nhập thư điện tử!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:8080/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: normalizedEmail }),
            });

            const data = await response.json().catch(() => ({}));
            if (response.ok && data?.result?.token && data?.result?.otp) {
                sessionStorage.setItem("resetToken", data.result.token);
                sessionStorage.setItem("otp", data.result.otp);

                alert("OTP đã được gửi tới thư điện tử. Vui lòng kiểm tra!");
                navigate("/reset_password");
            } else {
                alert(getForgotPasswordError(data));
            }
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối máy chủ!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f3f1] px-4 py-8 text-black sm:px-6 lg:px-8">
            <div className="mx-auto grid min-h-[78vh] max-w-7xl grid-cols-1 overflow-hidden rounded-[36px] border border-black/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
                <div className="flex flex-col border-b border-black/10 bg-[#f8f8f8] p-8 lg:border-b-0 lg:border-r lg:p-12">
                    <div>
                        <p className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#666]">
                            DTCLL SHOP - KHÔI PHỤC MẬT KHẨU
                        </p>

                        <h1 className="mt-8 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
                            Quên mật khẩu
                            <span className="block text-[#666]">Khôi phục tài khoản</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-[#5f6368]">
                            Nhập thư điện tử liên kết với tài khoản. Chúng tôi sẽ gửi mã xác minh
                            để bạn đặt lại mật khẩu một cách an toàn.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-[24px] border border-black/10 bg-white p-4">
                                <p className="text-2xl font-bold">Bảo mật</p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#7a7a7a]">
                                    Khôi phục
                                </p>
                            </div>
                            <div className="rounded-[24px] border border-black/10 bg-white p-4">
                                <p className="text-2xl font-bold">Nhanh chóng</p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#7a7a7a]">
                                    Gửi OTP
                                </p>
                            </div>
                            <div className="rounded-[24px] border border-black/10 bg-white p-4">
                                <p className="text-2xl font-bold">Đơn giản</p>
                                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#7a7a7a]">
                                    Các bước
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 rounded-[32px] bg-black p-8 text-white">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                            Hỗ trợ tài khoản
                        </p>
                        <p className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.03em]">
                            Khôi phục truy cập.
                        </p>
                        <p className="mt-1 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-white/70">
                            Tiếp tục an toàn.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center p-8 lg:p-12">
                    <div className="w-full max-w-xl">
                        <div className="mb-8">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
                                Đặt lại mật khẩu
                            </p>
                            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                                Xác minh thư điện tử
                            </h2>
                            <p className="mt-3 text-base leading-8 text-[#5f6368]">
                                Nhập thư điện tử của bạn để nhận mã xác minh đặt lại mật khẩu.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-sm font-semibold text-black">
                                    Thư điện tử
                                </label>
                                <div className="relative flex items-center gap-3 rounded-[20px] border border-black/10 bg-[#f7f7f7] px-4 py-4 transition focus-within:border-black">
                                    <Mail className="h-5 w-5 text-[#666]" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent text-base outline-none placeholder:text-[#9ca3af]"
                                        placeholder="Nhập thư điện tử của bạn"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-lg">
                                        *
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <button
                                    type="button"
                                    className="inline-flex h-14 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-black transition hover:bg-[#f3f3f3]"
                                    onClick={() => navigate("/login")}
                                >
                                    Đăng nhập
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex h-14 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-black transition hover:bg-[#f3f3f3]"
                                    onClick={() => navigate("/register")}
                                >
                                    Đăng ký
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition ${loading ? "cursor-not-allowed bg-[#6b7280]" : "bg-black hover:bg-[#2d2d2d]"
                                    }`}
                            >
                                {loading ? "Đang gửi..." : "Gửi mã xác minh"}
                                {!loading && <ArrowRight className="h-4 w-4" />}
                            </button>

                            <div className="rounded-[24px] border border-black/10 bg-[#f8f8f8] p-5">
                                <p className="text-sm font-semibold text-black">
                                    Lưu ý khôi phục
                                </p>
                                <p className="mt-2 text-sm leading-7 text-[#5f6368]">
                                    Sau khi nhận OTP qua thư điện tử, bạn sẽ được chuyển đến trang
                                    đặt lại mật khẩu để hoàn tất.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;