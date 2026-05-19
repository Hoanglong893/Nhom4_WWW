import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
      <footer className="border-t border-white/10 bg-[#172033] text-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4">
            {/* Brand */}
            <div className="space-y-5">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/95 px-5 py-3 shadow-[0_12px_24px_rgba(37,99,235,0.12)]">
                <div className="mr-3 h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-base font-extrabold uppercase tracking-[0.18em] text-slate-950">
                DTCLL SHOP
              </span>
              </div>

              <p className="max-w-xs text-sm leading-7 text-slate-300">
                Cửa hàng thời trang hiện đại với phong cách tối giản, dễ phối
                và trải nghiệm mua sắm thuận tiện cho mỗi ngày.
              </p>

              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                Phong cách thời trang tối giản
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="mb-5 text-lg font-bold tracking-tight text-white">
                Điều hướng
              </h3>

              <div className="flex flex-col gap-3">
                <Link
                    to="/"
                    className="text-sm text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  Trang chủ
                </Link>
                <Link
                    to="/product"
                    className="text-sm text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  Sản phẩm
                </Link>
                <Link
                    to="/about"
                    className="text-sm text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  Thương hiệu
                </Link>
                <Link
                    to="/policy"
                    className="text-sm text-slate-300 transition hover:translate-x-1 hover:text-white"
                >
                  Dịch vụ
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-5 text-lg font-bold tracking-tight text-white">
                Liên hệ
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Đường dây nóng
                    </p>
                    <p className="mt-1 text-sm text-slate-200">093 - 3462 - 6578</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Thư điện tử
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      support@dtcllshop.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                      Địa chỉ
                    </p>
                    <p className="mt-1 max-w-xs text-sm leading-6 text-slate-200">
                      Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="mb-5 text-lg font-bold tracking-tight text-white">
                Kết nối
              </h3>

              <div className="flex items-center gap-3">
                <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-500 hover:text-white"
                    aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>

                <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-500 hover:text-white"
                    aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>

                <a
                    href="#"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-500 hover:text-white"
                    aria-label="TikTok"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>

                <a
                    href="mailto:support@dtcllshop.com"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-slate-100 transition hover:-translate-y-1 hover:border-blue-400 hover:bg-blue-500 hover:text-white"
                    aria-label="Thư điện tử"
                >
                  <Mail size={18} />
                </a>
              </div>

              <p className="mt-5 max-w-xs text-sm leading-7 text-slate-300">
                Theo dõi DTCLL SHOP để cập nhật sản phẩm mới, ưu đãi và cảm
                hứng phối đồ hằng ngày.
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-slate-400">
              © 2025 DTCLL SHOP. Đã đăng ký bản quyền.
            </p>

            <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              <span>Bố cục tối giản</span>
              <span className="hidden sm:inline">•</span>
              <span>Thời trang hiện đại</span>
            </div>
          </div>
        </div>
      </footer>
  );
}


