// src/components/AdminChatBot.jsx
import { useState, useEffect, useRef } from "react";

const AdminAssistantAvatar = ({ className = "w-12 h-12" }) => (
  <div
    className={`${className} relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 text-white shadow-lg ring-2 ring-white/70`}
  >
    <svg viewBox="0 0 48 48" className="h-[78%] w-[78%]" fill="none" aria-hidden="true">
      <rect x="11" y="14" width="26" height="23" rx="10" fill="white" />
      <path d="M18 14a6 6 0 0 1 12 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="26" r="2.4" fill="#4f46e5" />
      <circle cx="28" cy="26" r="2.4" fill="#4f46e5" />
      <path d="M20 31.5c2.4 2 5.6 2 8 0" stroke="#4f46e5" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 21h16" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
      <path d="M38 25h2.3a3.3 3.3 0 0 1 0 6.6H38V25Z" fill="white" />
      <path d="M10 25H7.7a3.3 3.3 0 0 0 0 6.6H10V25Z" fill="white" />
      <path d="M35 9.5 36.2 13l3.3 1.2-3.3 1.3L35 19l-1.2-3.5-3.3-1.3 3.3-1.2L35 9.5Z" fill="#dbeafe" />
    </svg>
    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
  </div>
);

const ADMIN_QUICK_REPLIES = [
  "Báo cáo doanh thu hôm nay",
  "Đơn hàng đang chờ xử lý",
  "Sản phẩm bán chạy nhất",
  "Khách hàng mới trong tuần",
];

const AdminChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // ================== LOCALSTORAGE CHO ADMIN - F5 KHÔNG MẤT CHAT ==================
useEffect(() => {
  const saved = localStorage.getItem("DTCLL_admin_chat_history");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
        return;
      }
    } catch (e) {
      console.error("Lỗi parse admin chat history:", e);
      localStorage.removeItem("DTCLL_admin_chat_history");
    }
  }

  // Chỉ chào nếu thật sự không có lịch sử
  setMessages([
    {
      sender: "bot",
      text: "Chào sếp! Em là trợ lý CEO của DTCLL Shop đây ạ. Sếp cần báo cáo gì hôm nay?"
    }
  ]);
}, []); // Chỉ chạy 1 lần khi mount
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem("DTCLL_admin_chat_history", JSON.stringify(messages));
  }
}, [messages]);


  const send = async (messageOverride) => {
    const userMsg = (messageOverride ?? input).trim();
    if (!userMsg || loading) return;

    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/admin-chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ prompt: userMsg })
      });

      const reply = await res.text();
      setMessages(prev => [...prev, {
        sender: "bot",
        text: reply || "Em đang phân tích dữ liệu giúp sếp..."
      }]);
    } catch {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "Lỗi kết nối rồi sếp ơi, em đang thử lại..."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const hasUserMessage = messages.some((msg) => msg.sender === "user");

  return (
    <>
      {/* Nút mở chat admin */}
      <button
        onClick={() => setOpen(!open)}
        className="group fixed right-6 bottom-6 z-50 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 hover:shadow-indigo-500/50 ring-4 ring-white/60"
      >
       {open ? (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
) : (
  <AdminAssistantAvatar className="w-12 h-12 transition duration-300 group-hover:rotate-3 group-hover:scale-105" />
)}
      </button>

      {/* Cửa sổ chat Admin - SIÊU ĐẸP, SIÊU SANG */}
      {open && (
        <div className="fixed right-6 bottom-24 z-50 w-96 h-120 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header - Gradient tím sang trọng */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-4 flex items-center gap-4">
            <AdminAssistantAvatar className="w-12 h-12" />
            <div>
              <h3 className="font-bold text-lg">Trợ Lý CEO</h3>
              <p className="text-xs opacity-90 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Đang phân tích dữ liệu...
              </p>
            </div>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "user" ? (
                  <div className="max-w-xs px-5 py-3 rounded-2xl rounded-tr-none bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex max-w-[88%] items-start gap-3">
                    <AdminAssistantAvatar className="mt-1 w-8 h-8" />
                    <div className="min-w-0 flex-1">
                      <div className="px-5 py-3 rounded-2xl rounded-tl-none bg-white text-gray-800 border border-gray-200 shadow-md">
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>

                      {i === 0 && !hasUserMessage && !loading && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ADMIN_QUICK_REPLIES.map((reply) => (
                            <button
                              type="button"
                              key={reply}
                              onClick={() => send(reply)}
                              className="rounded-full border border-indigo-100 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Hiệu ứng đang gõ */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <AdminAssistantAvatar className="mt-1 w-8 h-8" />
                  <div className="bg-white px-5 py-3 rounded-2xl shadow rounded-tl-none border border-gray-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Hỏi em về doanh thu, kho, khách hàng..."
                className="flex-1 px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg hover:shadow-purple-500/50"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminChatBot;
