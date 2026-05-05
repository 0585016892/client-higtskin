import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  SendHorizontal, 
  Image as ImageIcon, 
  Sparkles, 
  User,
  Smile
} from "lucide-react";
import { sendChatbot } from "../api/chatbotApi";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const suggestions = [
    "🌸 Giờ mở cửa?",
    "✨ Tư vấn da dầu",
    "💆 Trị mụn",
    "💳 Bảng giá"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("spa_chat_history");
    if (saved) setChat(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("spa_chat_history", JSON.stringify(chat));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const typeText = (text) => {
    let index = 0;
    setChat(prev => [...prev, { sender: "bot", text: "" }]);
    const interval = setInterval(() => {
      index++;
      setChat(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = text.slice(0, index);
        return updated;
      });
      if (index >= text.length) clearInterval(interval);
    }, 15);
  };

const handleSend = async (customMessage = null) => {
  const msg = customMessage || message;
  if (!msg.trim() && !image) return;
  if (loading) return;

  const imgFile = image;

  // Hiển thị tin nhắn user trước
  if (msg) {
    setChat(prev => [...prev, { sender: "user", text: msg }]);
  }

  if (imgFile) {
    const preview = URL.createObjectURL(imgFile);
    setChat(prev => [...prev, { sender: "user", image: preview }]);
  }

  setMessage("");
  setImage(null);
  setLoading(true);

  try {
    const res = await sendChatbot({ message: msg, image: imgFile });

    if (!res?.success || !res?.reply) {
      typeText("Hiện hệ thống đang quá tải, bạn thử lại sau nhé 💖");
      return;
    }

    typeText(res.reply);

  } catch (err) {
    console.log("❌ FE Error:", err?.response?.data || err.message);

    if (err?.response?.status === 429) {
      typeText("Spa đang nhận quá nhiều yêu cầu, bạn đợi chút nhé 🌸");
    } else {
      typeText("Hệ thống tạm thời gián đoạn, bạn thử lại sau nhé ❤️");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.wrapper}>
      {/* Nút bong bóng chat chính */}
      {!open && (
        <button style={styles.chatButton} onClick={() => setOpen(true)}>
          <MessageCircle size={32} color="#fff" />
          <div style={styles.onlineBadge} />
        </button>
      )}

      {/* Khung Chat Container */}
      {open && (
        <div style={styles.chatContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerInfo}>
              <div style={styles.botAvatar}>
                <Sparkles size={18} color="#ff4d94" />
              </div>
              <div>
                <div style={styles.botName}>Highskin Spa</div>
                <div style={styles.botStatus}>Trực tuyến</div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea}>
            <div style={styles.welcomeDate}>Hôm nay</div>
            {chat.map((msg, i) => (
              <div key={i} style={{
                ...styles.messageRow, 
                flexDirection: msg.sender === "user" ? "row-reverse" : "row"
              }}>
                <div style={msg.sender === "user" ? styles.userIcon : styles.botIcon}>
                  {msg.sender === "user" ? <User size={14} /> : <Sparkles size={14} />}
                </div>
                <div style={{
                  ...styles.bubble,
                  background: msg.sender === "user" ? "linear-gradient(135deg, #ff4d94, #ff7eb3)" : "#fff",
                  color: msg.sender === "user" ? "#fff" : "#333",
                  borderRadius: msg.sender === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  boxShadow: msg.sender === "user" ? "0 4px 12px rgba(255, 77, 148, 0.2)" : "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  {msg.text && <div>{msg.text}</div>}
                  {msg.image && <img src={msg.image} alt="upload" style={styles.msgImage} />}
                </div>
              </div>
            ))}
            {loading && <div style={styles.typing}>Bot đang soạn tin...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div style={styles.suggestionWrapper}>
            {suggestions.map((s, i) => (
              <button key={i} style={styles.suggestionBtn} onClick={() => handleSend(s)}>
                {s}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <div style={styles.footer}>
            {image && (
              <div style={styles.imagePreview}>
                <img src={URL.createObjectURL(image)} alt="preview" style={styles.previewThumb} />
                <button onClick={() => setImage(null)} style={styles.removeImg}><X size={12} /></button>
              </div>
            )}
            <div style={styles.inputContainer}>
              <button style={styles.iconBtn} onClick={() => fileInputRef.current.click()}>
                <ImageIcon size={20} color="#666" />
              </button>
              <input
                type="file" hidden ref={fileInputRef} accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <input
                style={styles.inputField}
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button 
                style={{
                  ...styles.sendBtn, 
                  background: (message || image) ? "#ff4d94" : "#f0f0f0"
                }} 
                onClick={() => handleSend()}
                disabled={!message && !image}
              >
                <SendHorizontal size={18} color={(message || image) ? "#fff" : "#ccc"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 30,
    right: 30,
    zIndex: 9999,
    fontFamily: "'Inter', sans-serif"
  },
  chatButton: {
    width: 64,
    height: 64,
    borderRadius: "22px",
    background: "linear-gradient(135deg, #ff4d94 0%, #ff7eb3 100%)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 25px rgba(255, 77, 148, 0.4)",
    transition: "transform 0.3s ease",
  },
  onlineBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    background: "#4ade80",
    border: "3px solid #fff",
    borderRadius: "50%"
  },
  chatContainer: {
    width: 380,
    height: 600,
    background: "#f8f9fa",
    borderRadius: "28px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    overflow: "hidden",
    animation: "slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  },
  header: {
    padding: "20px",
    background: "#fff",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  botAvatar: {
    width: 38,
    height: 38,
    background: "#fff0f6",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #ffdeeb"
  },
  botName: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#1a1a1a"
  },
  botStatus: {
    fontSize: "12px",
    color: "#4ade80",
    fontWeight: "500"
  },
  closeBtn: {
    background: "#f5f5f5",
    border: "none",
    width: 32,
    height: 32,
    borderRadius: "50%",
    cursor: "pointer",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  messagesArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  welcomeDate: {
    textAlign: "center",
    fontSize: "12px",
    color: "#bbb",
    margin: "10px 0"
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px"
  },
  botIcon: {
    width: 24,
    height: 24,
    borderRadius: "8px",
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff4d94"
  },
  userIcon: {
    width: 24,
    height: 24,
    borderRadius: "8px",
    background: "#ffdeeb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff4d94"
  },
  bubble: {
    padding: "12px 16px",
    fontSize: "14px",
    maxWidth: "75%",
    lineHeight: "1.5"
  },
  msgImage: {
    width: "100%",
    borderRadius: "10px",
    marginTop: "8px"
  },
  suggestionWrapper: {
    display: "flex",
    gap: "8px",
    padding: "10px 20px",
    overflowX: "auto",
    scrollbarWidth: "none"
  },
  suggestionBtn: {
    background: "#fff",
    border: "1px solid #eee",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    color: "#666",
    transition: "0.2s"
  },
  footer: {
    padding: "15px 20px 25px",
    background: "#fff"
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    background: "#f1f3f5",
    borderRadius: "16px",
    padding: "6px 6px 6px 15px",
    gap: "10px"
  },
  inputField: {
    flex: 1,
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "14px",
    color: "#333"
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: "12px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.3s"
  },
  typing: {
    fontSize: "12px",
    color: "#aaa",
    fontStyle: "italic"
  },
  imagePreview: {
    position: "relative",
    display: "inline-block",
    marginBottom: "10px"
  },
  previewThumb: {
    width: 50,
    height: 50,
    borderRadius: "8px",
    objectFit: "cover",
    border: "2px solid #ff4d94"
  },
  removeImg: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "2px"
  }
};

// CSS Animation
if (typeof document !== 'undefined') {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .suggestionWrapper::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(style);
}