import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import dauTick from "../assets/dauTick.png";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";
const QrPayment = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const invoiceId = params.get("invoiceId");
  const [realAmount, setRealAmount] = useState(0);
  const [realInvoiceCode, setRealInvoiceCode] = useState("");
  const interval = useRef(null);

  const qrCode = realAmount > 0 && realInvoiceCode
    ? `https://qr.sepay.vn/img?acc=0398757483&bank=MBBank&amount=${realAmount}&des=${realInvoiceCode}`
    : "";

  const handleFetchInvoiceById = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:8080/invoices/${invoiceId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const invoice = await res.json();
      console.log("new invoice", invoice);
      if (invoice) {
        if (invoice.totalAmount) {
          setRealAmount(invoice.totalAmount);
        }
        if (invoice.invoiceCode) {
          setRealInvoiceCode(invoice.invoiceCode);
        }
        if (invoice.paymentStatus === "PAID") {
          clearInterval(interval.current);
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }
      }
    } catch (error) {
      console.log("Invoice not found", error);
    }
  };

  useEffect(() => {
    handleFetchInvoiceById();
    interval.current = setInterval(() => {
      handleFetchInvoiceById();
    }, 5000);

    return () => clearInterval(interval.current);
  }, []);

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <img
            className="size-28 mx-auto mb-6 drop-shadow-lg"
            src={dauTick}
            alt="Thanh toán thành công"
          />

          <h3 className="text-3xl font-extrabold text-gray-900 mb-3">
            Thanh toán thành công
          </h3>

          <p className="text-gray-600 mb-8 text-sm">
            Giao dịch của bạn đã hoàn tất. Cảm ơn bạn đã mua sắm tại DTCLL Shop!
          </p>

          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-black text-white rounded-full font-semibold
                 hover:bg-red-500 transition-all duration-300 transform
                 hover:scale-105 shadow-lg"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-2 gap-10">
      <div className="flex flex-col justify-center items-center bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Quét mã QR để thanh toán
        </h2>
        <img
          src={qrCode}
          alt="Mã QR thanh toán"
          className="w-64 h-64 object-contain mb-4"
        />
        <p className="text-gray-500 text-center">
          Dùng ứng dụng ngân hàng để quét mã QR và hoàn tất thanh toán.
        </p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Thông tin thanh toán</h2>
        <div className="flex items-center gap-4 border p-4 rounded-xl bg-blue-50 border-blue-200">
          <img
            className="w-16 h-16 object-contain"
            src="https://play-lh.googleusercontent.com/t7F9E1HglpFrmXzXGO7u-hnTSKkFW3ZmXJdmS97WaOnUgrySvAXVgwncj1uE4_3LcA"
            alt="Logo MBBank"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">MBBank</span>
            <span className="text-gray-500 text-sm">Chuyển khoản ngân hàng</span>
          </div>
        </div>
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Tên tài khoản:</span>
            <span className="font-medium">NGUYEN HOANG LONG</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Số tài khoản:</span>
            <span className="font-medium">0398757483</span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Số tiền:</span>
            <span className="font-semibold text-blue-600">
              {realAmount ? realAmount.toLocaleString("vi-VN") : "..."} VNĐ
            </span>
          </div>
          <div className="flex justify-between border-b pb-2 border-gray-200">
            <span>Nội dung chuyển khoản:</span>
            <span className="font-semibold">{realInvoiceCode || "..."}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2">
          Vui lòng thanh toán theo đúng thông tin trên để đơn hàng được xử lý.
        </p>
      </div>
      <ChatBot />
      <Contact />
    </div>
  );
};

export default QrPayment;



