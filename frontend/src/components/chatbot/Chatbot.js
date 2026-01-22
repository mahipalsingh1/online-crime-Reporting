import React, { useState, useRef, useEffect } from "react";
import { chatbotData } from "./ChatbotData";
import "./Chatbot.css";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hi! I’m CRIMSAFE Assistant. Ask me anything." }
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  /* =========================
     AUTO SCROLL TO LAST MESSAGE
  ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     BOT LOGIC
  ========================= */
  const getBotReply = (msg) => {
    const text = msg.toLowerCase();

    for (let item of chatbotData) {
      if (item.keywords.some((k) => text.includes(k))) {
        return item.response;
      }
    }

    return "🤖 Sorry, I didn’t understand that. You can ask about complaints, status, emergency, or call support 📞 9024383761";
  };

  /* =========================
     SEND MESSAGE
  ========================= */
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const botReply = getBotReply(input);
    const botMsg = { sender: "bot", text: botReply };

    // ✅ SAFE STATE UPDATE
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chatbot-btn" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            CRIMSAFE AI Assistant
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;