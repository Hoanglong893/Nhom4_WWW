// src/components/Contact.jsx
import React, { useState, useEffect } from "react";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false); // THÊM STATE NÀY

  // Nghe sự kiện từ ChatBot
  useEffect(() => {
    const handleChatBotOpened = () => setIsChatBotOpen(true);
    const handleChatBotClosed = () => setIsChatBotOpen(false);

    window.addEventListener("chatbotOpened", handleChatBotOpened);
    window.addEventListener("chatbotClosed", handleChatBotClosed);

    return () => {
      window.removeEventListener("chatbotOpened", handleChatBotOpened);
      window.removeEventListener("chatbotClosed", handleChatBotClosed);
    };
  }, []);

  // Nếu chatbot đang mở → ẩn hoàn toàn nút Contact
  if (isChatBotOpen) return null;

  return (
    <div className="fixed right-6 bottom-28 z-40"> {/* z-40 < z-50 của chatbot */}
      {/* NÚT CHÍNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 ring-4 ring-white/50"
      >
        <div className="absolute -inset-1 bg-red-600/60 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition"></div>

        {/* ICON HỖ TRỢ KHÁCH HÀNG */}
        <svg className="w-9 h-9 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12a8 8 0 0 1 16 0v4.5A2.5 2.5 0 0 1 17.5 19H16"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19a3 3 0 0 0 6 0m-3-8.5v2.25m0 3.75h.01"
          />
        </svg>
      </button>

      {/* DROPDOWN */}
      <div className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        {/* Messenger */}
        <a href="https://www.facebook.com/hnglng.o8/" target="_blank" rel="noopener noreferrer"
          className="group/item relative" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all overflow-hidden ring-4 ring-white/60 bg-white">
            <img
              src="https://static.wikia.nocookie.net/logopedia/images/f/f4/Facebook_Messenger_2025.svg"
              alt="Messenger"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
            Trò chuyện qua Messenger
          </span>
        </a>

        {/* Zalo */}
        <a href="https://zalo.me/0398757483" target="_blank" rel="noopener noreferrer"
          className="group/item relative" onClick={() => setIsOpen(false)}>
          <div className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-all overflow-hidden ring-4 ring-white/60 bg-white">
            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Zalo-Arc.png" alt="Zalo" className="w-full h-full object-cover" />
          </div>
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
            Trò chuyện qua Zalo
          </span>
        </a>
      </div>
    </div>
  );
};

export default Contact;

