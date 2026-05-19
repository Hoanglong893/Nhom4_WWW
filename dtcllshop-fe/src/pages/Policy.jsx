import React from "react";
import {
  Package,
  Shield,
  Truck,
  RefreshCw,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const Policy = () => {
  const conditions = [
    {
      icon: <Package className="h-6 w-6" />,
      title: "Tình trạng sản phẩm",
      description:
          "Sản phẩm phải chưa sử dụng, chưa giặt và không có mùi lạ như mùi cơ thể, nước hoa hoặc hóa chất.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Tem mác và nhãn sản phẩm",
      description:
          "Tem mác và nhãn sản phẩm phải còn nguyên, không bị rách, tháo bỏ hoặc chỉnh sửa.",
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Bao bì gốc",
      description:
          "Sản phẩm cần được gửi lại cùng bao bì và phụ kiện gốc, trong tình trạng như khi nhận hàng.",
    },
  ];

  const freeReturnCases = [
    {
      title: "Lỗi từ nhà sản xuất",
      description:
          "Sản phẩm có lỗi sản xuất có thể xác minh như rách đường may, lỗi màu/in hoặc hoàn thiện kém.",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      title: "Gửi sai sản phẩm",
      description:
          "Sản phẩm nhận được sai kích cỡ, màu sắc hoặc mẫu so với đơn hàng ban đầu.",
      icon: <RefreshCw className="h-5 w-5" />,
    },
    {
      title: "Hết hàng để đổi",
      description:
          "Khách hàng yêu cầu đổi kích cỡ nhưng sản phẩm đã được xác nhận hết hàng.",
      icon: <Package className="h-5 w-5" />,
    },
  ];

  const requestFields = [
    "Họ tên khách hàng",
    "Số điện thoại liên hệ",
    "Mã đơn hàng",
    "Tên sản phẩm",
    "Lý do yêu cầu",
    "Mô tả chi tiết vấn đề / yêu cầu",
    "Tệp đính kèm",
  ];

  return (
      <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* HERO */}
          <section className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)] sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                  DTCLL SHOP • TRUNG TÂM HỖ TRỢ
                </p>

                <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Chính sách đổi trả,
                  <span className="block text-blue-700">Rõ ràng và minh bạch</span>
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  Trang này giải thích các trường hợp được đổi trả, điều kiện áp dụng
                  và cách gửi yêu cầu hỗ trợ rõ ràng nhất.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-full border border-blue-600 bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]">
                    Áp dụng trong 15 ngày
                  </div>
                  <div className="rounded-full border border-blue-100 bg-blue-50 px-5 py-3 text-sm font-semibold text-slate-700">
                    Miễn phí một chiều cho trường hợp hợp lệ
                  </div>
                  <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                    Liên hệ hỗ trợ
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="group rounded-[28px] border border-slate-200 bg-white p-6 text-slate-950 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-blue-700">
                    Điều kiện
                  </p>
                  <p className="mt-3 text-5xl font-extrabold">15</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 transition group-hover:text-slate-700">
                    Ngày kể từ khi khách hàng nhận sản phẩm.
                  </p>
                </div>

                <div className="group rounded-[28px] border border-slate-200 bg-white p-6 text-slate-950 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-blue-700">
                    Hỗ trợ vận chuyển
                  </p>
                  <p className="mt-3 text-2xl font-extrabold">Miễn phí một chiều</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 transition group-hover:text-slate-700">
                    Áp dụng cho các trường hợp đổi trả hợp lệ đã được xác minh.
                  </p>
                </div>

                <div className="group rounded-[28px] border border-slate-200 bg-white p-6 text-slate-950 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50 sm:col-span-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 transition group-hover:text-blue-700">
                    Lưu ý quan trọng
                  </p>
                  <p className="mt-3 text-lg font-bold">
                    Nên giữ bằng chứng sản phẩm và video mở hàng nếu có thể.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 transition group-hover:text-slate-700">
                    Điều này giúp bộ phận hỗ trợ xác minh vấn đề nhanh hơn và xử lý
                    yêu cầu chính xác hơn.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 3-STEP FLOW */}
          <section className="mt-20">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Quy trình nhanh
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Cách thực hiện
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group rounded-[30px] border border-slate-200 bg-white p-7 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-lg font-bold text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  1
                </div>
                <h3 className="text-2xl font-bold">Kiểm tra điều kiện</h3>
                <p className="mt-3 leading-8 text-slate-600 transition group-hover:text-slate-700">
                  Kiểm tra các điều kiện bắt buộc và xác nhận sản phẩm vẫn đủ điều kiện đổi trả.
                </p>
              </div>

              <div className="group rounded-[30px] border border-slate-200 bg-white p-7 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-lg font-bold text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  2
                </div>
                <h3 className="text-2xl font-bold">Chuẩn bị minh chứng</h3>
                <p className="mt-3 leading-8 text-slate-600 transition group-hover:text-slate-700">
                  Giữ bao bì, tem mác, ảnh lỗi và video mở hàng nếu có trước khi liên hệ hỗ trợ.
                </p>
              </div>

              <div className="group rounded-[30px] border border-slate-200 bg-white p-7 text-slate-950 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-lg font-bold text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  3
                </div>
                <h3 className="text-2xl font-bold">Gửi yêu cầu</h3>
                <p className="mt-3 leading-8 text-slate-600 transition group-hover:text-slate-700">
                  Dùng mẫu yêu cầu bên dưới và liên hệ DTCLL SHOP qua các kênh hỗ trợ đã liệt kê.
                </p>
              </div>
            </div>
          </section>

          {/* CONDITIONS */}
          <section className="mt-20 rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-10">
            <div className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Yêu cầu đổi trả
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Điều kiện bắt buộc
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Để được đổi trả, sản phẩm phải đáp ứng đầy đủ các điều kiện bên dưới.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {conditions.map((condition, index) => (
                  <div
                      key={index}
                      className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                      {condition.icon}
                    </div>
                    <h3 className="text-2xl font-bold">{condition.title}</h3>
                    <p className="mt-3 leading-8 text-slate-600 transition group-hover:text-slate-700">
                      {condition.description}
                    </p>
                  </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-blue-100 bg-blue-50 p-6 text-slate-800">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Lưu ý quan trọng</h3>
                  <p className="mt-2 leading-8 text-slate-600">
                    Khuyến nghị quay video mở hàng để hỗ trợ khiếu nại và rút ngắn thời gian xác minh.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ELIGIBLE CASES */}
          <section className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[36px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 p-8 text-slate-950 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Trường hợp hỗ trợ
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Trường hợp được đổi trả
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Đây là các trường hợp DTCLL SHOP hỗ trợ đổi trả và chi trả phí vận chuyển một chiều.
              </p>

              <div className="mt-8 inline-flex rounded-full border border-blue-100 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-[0_10px_24px_rgba(37,99,235,0.10)]">
                ✓ Miễn phí vận chuyển đổi trả một chiều
              </div>
            </div>

            <div className="space-y-5">
              {freeReturnCases.map((item, index) => (
                  <div
                      key={index}
                      className="group rounded-[28px] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <p className="mt-2 leading-8 text-slate-600 transition group-hover:text-slate-700">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
              ))}

              <p className="px-2 text-sm italic text-slate-600">
                DTCLL SHOP chi trả phí vận chuyển phát sinh cho các trường hợp đổi trả được hỗ trợ ở trên.
              </p>
            </div>
          </section>

          {/* KHÁCH HÀNG PAID */}
          <section className="mt-20">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Khách hàng tự thanh toán phí vận chuyển
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Trường hợp khách hàng chịu phí
              </h2>
            </div>

            <div className="mx-auto max-w-4xl rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Đổi size</h3>
                  <p className="mt-3 leading-8 text-slate-600">
                    Khách hàng tự thanh toán phí vận chuyển khi đổi kích cỡ do không vừa,
                    tùy theo tình trạng hàng còn trong kho.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TEMPLATE */}
          <section className="mt-20 rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-10">
            <div className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Mẫu hỗ trợ
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Mẫu yêu cầu đổi trả
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Để được hỗ trợ nhanh nhất, vui lòng cung cấp đầy đủ các thông tin bên dưới
                khi liên hệ bộ phận chăm sóc khách hàng.
              </p>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-slate-200">
              <div className="border-b border-slate-200 bg-blue-50/70 px-6 py-5">
                <h3 className="flex items-center gap-3 text-2xl font-bold text-slate-950">
                  <ArrowRightLeft className="h-6 w-6 text-blue-700" />
                  MẪU YÊU CẦU DTCLL SHOP
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 bg-white p-6 sm:grid-cols-2">
                {requestFields.map((field, index) => (
                    <div
                        key={index}
                        className={`rounded-2xl border border-[#E0E0E0] bg-[#F9F9F9] p-4 transition hover:border-blue-300 hover:bg-white ${
                            field === "Mã đơn hàng" ||
                            field === "Tên sản phẩm" ||
                            field === "Lý do yêu cầu" ||
                            field === "Mô tả chi tiết vấn đề / yêu cầu" ||
                            field === "Tệp đính kèm"
                                ? "sm:col-span-2"
                                : ""
                        }`}
                    >
                      <p className="text-sm font-bold text-slate-950">{field}</p>
                      <p className="mt-2 text-sm text-slate-500">
                        [Điền thông tin tại đây]
                      </p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="mt-20">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Kênh liên hệ
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Thông tin liên hệ
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600">
                Nếu có câu hỏi, yêu cầu đổi trả hoặc khiếu nại, vui lòng liên hệ đội ngũ hỗ trợ qua các kênh bên dưới.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Thư điện tử hỗ trợ</h3>
                <p className="mt-3 text-slate-600 transition group-hover:text-slate-700">
                  support@dtcllshop.com
                </p>
              </div>

              <div className="group rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Đường dây nóng / Zalo</h3>
                <p className="mt-3 text-slate-600 transition group-hover:text-slate-700">
                  +84 901 234 567
                </p>
              </div>

              <div className="group rounded-[28px] border border-slate-200 bg-white p-7 text-center shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Kho nhận hàng hoàn</h3>
                <p className="mt-3 text-slate-600 transition group-hover:text-slate-700">
                  [Địa chỉ nhận hàng đổi trả]
                </p>
              </div>
            </div>
          </section>

          {/* COMMITMENT */}
          <section className="mt-20 rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-10">
            <div className="mb-10 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Cam kết dịch vụ
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                Cam kết và quyền từ chối
              </h2>
            </div>

            <div className="mx-auto max-w-4xl space-y-5">
              <div className="group rounded-[28px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Cam kết của chúng tôi</h3>
                    <p className="mt-2 leading-8 text-slate-600 transition group-hover:text-slate-700">
                      Chúng tôi cam kết hỗ trợ nhanh chóng và đáng tin cậy sau khi nhận được yêu cầu của bạn.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-[28px] border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700 transition group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Quyền từ chối</h3>
                    <p className="mt-2 leading-8 text-slate-600 transition group-hover:text-slate-700">
                      DTCLL SHOP có quyền từ chối các yêu cầu đổi trả không đáp ứng điều kiện bắt buộc nêu trên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <ChatBot />
        <Contact />
      </div>
  );
};

export default Policy;

