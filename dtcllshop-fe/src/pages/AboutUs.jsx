import React from "react";
import { Quote, MapPin } from "lucide-react";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const About = () => {
    const mainImage =
        "aboutus.png";
    const image2 =
        "bentrong.png";
    const image3 =
        "nguoithat.png";
    const image4 =
        "bentrongcuahang.png";
    const headerImage =
        "cuahang.png";

    const quotes = [
        {
            id: 1,
            shortText: "Chúng tôi tập trung vào sản phẩm chất lượng, hợp xu hướng.",
            fullText:
                "DTCLL SHOP chọn lọc sản phẩm chất lượng, hợp xu hướng và phù hợp với khách hàng trẻ yêu thời trang.",
        },
        {
            id: 2,
            shortText: "Chúng tôi mang đến thời trang hằng ngày hiện đại và chỉn chu.",
            fullText: "Chúng tôi hướng đến những thiết kế bắt mắt, tinh gọn và có tính ứng dụng cao.",
        },
        {
            id: 3,
            shortText: "Thời trang nên trở thành một phần tự nhiên của đời sống.",
            fullText:
                "Mỗi sản phẩm đều được tạo ra để giúp phong cách cá nhân xuất hiện rõ hơn trong cuộc sống hằng ngày.",
        },
        {
            id: 4,
            shortText: "Sứ mệnh của chúng tôi là giúp bạn tự tin thể hiện phong cách riêng.",
            fullText:
                "DTCLL SHOP đồng hành để bạn sống đúng cá tính và định hình phong cách riêng qua những lựa chọn sáng tạo.",
        },
    ];

    const timeline = [
        {
            year: "2020 - 2024",
            title: "Nền tảng",
            desc: "Được xây dựng bởi 5 thành viên cùng chung định hướng mang thời trang chất lượng đến giới trẻ Việt Nam.",
        },
        {
            year: "Định hướng ban đầu",
            title: "Basic & Classic",
            desc: "Định hướng ban đầu tập trung vào các sản phẩm basic và classic dễ mặc, dễ phối cho phong cách hằng ngày.",
        },
        {
            year: "Chuyển mình",
            title: "Thích nghi và phát triển",
            desc: "Khi xu hướng thời trang thay đổi nhanh, DTCLL SHOP thích nghi, làm mới hình ảnh và tìm được bản sắc riêng.",
        },
        {
            year: "2025",
            title: "Ra mắt chính thức",
            desc: "DTCLL SHOP chính thức ra mắt với nhận diện tinh gọn, phong cách hiện đại và trải nghiệm mua sắm mới.",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* HERO */}
                <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
                    <div className="flex flex-col justify-center rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-10">
                        <p className="inline-flex w-fit rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                            DTCLL SHOP • TUYÊN NGÔN THƯƠNG HIỆU
                        </p>

                        <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                            Sinh ra cho
                            <span className="block text-blue-700">Cá tính hiện đại</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            DTCLL SHOP là thương hiệu thời trang hiện đại được xây dựng quanh
                            sự tối giản, cá tính riêng và cảm giác chỉn chu. Chúng tôi tin
                            thời trang hằng ngày nên dễ mặc, tự tin và tinh tế.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                            <div className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
                                <p className="text-2xl font-bold">2025</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                                    Ra mắt
                                </p>
                            </div>
                            <div className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-4">
                                <p className="text-2xl font-bold">Việt Nam</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                                    Bản sắc
                                </p>
                            </div>
                            <div className="rounded-[24px] border border-blue-100 bg-blue-50/70 p-4 col-span-2 sm:col-span-1">
                                <p className="text-2xl font-bold">Tối giản</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                                    Định hướng
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
                        <img
                            src={headerImage}
                            alt="Hình ảnh thương hiệu DTCLL"
                            className="h-full min-h-[360px] w-full object-cover opacity-90"
                        />
                    </div>
                </section>

                {/* INTRO + QUOTES */}
                <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                    {/* Left visual */}
                    <div className="self-start overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)]">                        <div className="relative">
                            <img
                                src={mainImage}
                                alt="Cảm hứng thời trang"
                                className="h-[560px] w-full object-cover"
                            />

                            <div className="absolute left-5 top-5 rounded-full border border-blue-100 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
                                Từ 2025
                            </div>

                            <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-slate-200 bg-white/95 p-5 backdrop-blur-md">
                                <p className="text-base font-semibold text-slate-950 sm:text-lg">
                                    <MapPin className="mr-2 inline h-5 w-5 text-blue-700" />
                                    Phát triển tại Việt Nam
                                </p>
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                    Chúng tôi lấy cảm hứng từ đời sống hằng ngày, thẩm mỹ gọn
                                    gàng và văn hóa trẻ hiện đại, rồi chuyển hóa thành sản phẩm
                                    dễ mặc.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right content */}
                    <div className="space-y-5">
                        <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                                Tổng quan thương hiệu
                            </p>
                            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                                Câu chuyện thương hiệu tinh gọn
                            </h2>
                            <p className="mt-4 text-base leading-8 text-slate-600">
                                Thay vì chạy theo những công thức thời trang ồn ào, DTCLL SHOP
                                tập trung vào ngôn ngữ hình ảnh tối giản và trải nghiệm mua sắm
                                cân bằng hơn. Định hướng của chúng tôi hiện đại, gần gũi và
                                được tạo nên từ sự tinh gọn.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {quotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    className="group rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                                >
                                    <p className="text-lg font-semibold leading-8 text-slate-950 transition group-hover:text-blue-900">
                                        <Quote className="mr-2 inline h-5 w-5 text-blue-700" />
                                        {quote.shortText}
                                    </p>

                                    <div className="mt-3 border-t border-slate-200 pt-3 transition group-hover:border-blue-100">
                                        <p className="text-sm leading-7 text-slate-600 transition group-hover:text-slate-700">
                                            "{quote.fullText}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TIMELINE -BỐ CỤC */}
                <section className="mt-20">
                    <div className="mb-10 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                            Dòng thời gian
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                            Câu chuyện của chúng tôi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {timeline.map((item, index) => (
                            <div
                                key={index}
                                className="group rounded-[30px] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_10px_26px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                            >
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700 transition group-hover:text-blue-800">
                                    {item.title}
                                </p>

                                <h3 className="mt-4 text-2xl font-extrabold">
                                    {item.year}
                                </h3>

                                <p className="mt-4 text-sm leading-8 text-slate-600 transition group-hover:text-slate-700">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STORE VIEW */}
                <section className="mt-20">
                    <div className="mb-10 text-center">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                            Hình ảnh thương hiệu
                        </p>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                            Không gian cửa hàng
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {[
                            { src: image2, label: "Tinh tế" },
                            { src: image3, label: "Hợp xu hướng" },
                            { src: image4, label: "Thời trang" },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-[28px] border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                            >
                                <img
                                    src={item.src}
                                    alt={item.label}
                                    className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-slate-950/15 transition group-hover:bg-slate-950/25" />
                                <div className="absolute bottom-5 left-5 rounded-full border border-blue-100 bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700 shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SLOGAN */}
                <section className="mt-20">
                    <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                                Tuyên ngôn thương hiệu
                            </p>

                            <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">
                                Ít ồn ào. Nhiều phong cách.
                            </h2>

                            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
                                DTCLL SHOP theo đuổi định hướng hình ảnh tinh gọn, tập trung
                                vào sự tối giản, phom dáng hiện đại và trải nghiệm thời trang
                                hằng ngày chỉn chu hơn.
                            </p>

                            <div className="mt-10 rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-6 py-12 text-slate-950 sm:px-12">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                                    Tinh thần cốt lõi
                                </p>

                                <p className="mt-6 text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
                                    Ít ồn ào.
                                </p>
                                <p className="mt-2 text-3xl font-extrabold leading-tight tracking-[-0.03em] text-blue-700 sm:text-5xl">
                                    Nhiều phong cách.
                                </p>
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

export default About;
