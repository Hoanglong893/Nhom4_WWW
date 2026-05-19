// src/components/ChatBot.jsx
import { useState, useEffect, useRef } from "react";

const INITIAL_MESSAGE =
  "Xin chào! Mình là trợ lý mua sắm đây. Bạn đang tìm sản phẩm nào hôm nay?";

const QUICK_REPLIES = [
  "Xem hàng mới về",
  "Hỏi chính sách đổi trả",
  "Cần tư vấn size",
];

const AssistantAvatar = ({ className = "h-10 w-10" }) => (
  <div
    className={`${className} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-md ring-2 ring-white`}
  >
    <svg viewBox="0 0 48 48" className="h-[78%] w-[78%]" fill="none" aria-hidden="true">
      <rect x="12" y="15" width="24" height="21" rx="10" fill="white" />
      <path d="M18 15a6 6 0 0 1 12 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="27" r="2.4" fill="#2563eb" />
      <circle cx="28" cy="27" r="2.4" fill="#2563eb" />
      <path d="M20 32c2.4 2 5.6 2 8 0" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M38 25.5h2.5a3.5 3.5 0 0 1 0 7H38v-7Z" fill="white" />
      <path d="M10 25.5H7.5a3.5 3.5 0 0 0 0 7H10v-7Z" fill="white" />
      <path d="M36 10.5 37.3 14l3.2 1.3-3.2 1.2L36 20l-1.3-3.5-3.2-1.2 3.2-1.3L36 10.5Z" fill="#bfdbfe" />
    </svg>
  </div>
);

const ChatBot = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("DTCLL_chat_history");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.length > 1 || (parsed.length === 1 && parsed[0].sender === "user")) {
        setMessages(parsed);
      }
    } catch (e) {
      console.error("Lỗi parse chat history:", e);
    }
  }, []);

  useEffect(() => {
    const hasRealMessage =
      messages.length > 1 || (messages.length === 1 && messages[0].sender === "user");

    if (hasRealMessage) {
      localStorage.setItem("DTCLL_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("DTCLL_chat_history");
      setMessages([{ sender: "bot", text: INITIAL_MESSAGE }]);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const openChat = () => {
    setChatOpen(true);
    window.dispatchEvent(new Event("chatbotOpened"));
  };

  const closeChat = () => {
    setChatOpen(false);
    window.dispatchEvent(new Event("chatbotClosed"));
  };

  const sendMessage = async (messageOverride) => {
    const userMessage = (messageOverride ?? input).trim();
    if (!userMessage || chatLoading) return;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setChatLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch("http://localhost:8080/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.message || "Dạ em chưa hiểu lắm ạ!",
          suggestedProducts: data.suggestedProducts || [],
          compareIds: data.compareIds || null,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Oops! Có lỗi kết nối rồi, thử lại sau ít phút nhé!",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasUserMessage = messages.some((msg) => msg.sender === "user");

  return (
    <>
      {!chatOpen && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Mở trợ lý mua sắm"
          className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-2xl shadow-blue-500/30 ring-4 ring-white/70 transition-all duration-300 hover:scale-110"
        >
          <div className="absolute inset-0 -z-10 rounded-full bg-blue-500/60 blur-xl opacity-70 transition duration-300 group-hover:opacity-100" />
          <AssistantAvatar className="h-12 w-12 transition duration-300 group-hover:rotate-3 group-hover:scale-105" />
        </button>
      )}

      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[34rem] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:bottom-6 sm:right-6">
          <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 via-white to-sky-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <AssistantAvatar className="h-11 w-11" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Trợ lý mua sắm</h3>
                <p className="text-xs text-slate-500">Online - Hỗ trợ 24/7</p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeChat}
              aria-label="Thu nhỏ trợ lý mua sắm"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, i) => (
              <div
                key={`${msg.sender}-${i}`}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "user" ? (
                  <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-blue-600 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                    {msg.text}
                  </div>
                ) : (
                  <div className="flex max-w-[92%] items-start gap-2">
                    <AssistantAvatar className="mt-1 h-8 w-8" />
                    <div className="min-w-0 flex-1">
                    <div className="whitespace-pre-wrap rounded-2xl rounded-tl-md border border-slate-200 bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800 shadow-sm">
                      {msg.text}
                    </div>

                    {i === 0 && !hasUserMessage && !chatLoading && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {QUICK_REPLIES.map((reply) => (
                          <button
                            type="button"
                            key={reply}
                            onClick={() => sendMessage(reply)}
                            className="rounded-full border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.suggestedProducts.map((product) => (
                          <a
                            key={product.id}
                            href={`/product/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-semibold text-blue-700">Xem ngay: {product.name}</p>
                                <p className="mt-1 text-xs text-slate-500">Click để xem chi tiết sản phẩm</p>
                              </div>
                              <span className="text-xl text-blue-500">→</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.compareIds && msg.compareIds.length >= 2 && (
                      <div className="mt-3">
                        <a
                          href={`/compare?ids=${msg.compareIds.join(",")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold text-blue-700">
                                So sánh {msg.compareIds.length} sản phẩm
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Bảng so sánh sẽ hiển thị form, chất liệu, giá và size.
                              </p>
                            </div>
                            <span className="text-xl text-blue-500">→</span>
                          </div>
                        </a>
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <AssistantAvatar className="mt-1 h-8 w-8" />
                  <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-slate-100 px-4 py-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-100" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 delay-200" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                disabled={chatLoading}
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={chatLoading || !input.trim()}
                aria-label="Gửi tin nhắn"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.4 20.4 21 12 3.4 3.6 3 10.1l11 1.9-11 1.9.4 6.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
