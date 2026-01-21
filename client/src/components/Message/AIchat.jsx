import React, { useState, useEffect } from "react";
import "./AIchat.css";
import axios from 'axios';

const ChatAIApp = () => {

//Tạo usestate lưu message của AI và User
  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("ai-saved-chats");
    return savedChats ? JSON.parse(savedChats) : [];
  });
  
// Tạo ustate chứa theme màu
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ai-themeColor") || "dark_mode";
    
  });

  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true); // Trạng thái hiển thị danh sách gợi ý

  const API_KEY = "AIzaSyCisebTI3vrYT_dAXohosYCNbgvaNBbN1k";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const [data, setData] = useState([]);

  const loadData = async () => {
    const response = await axios.get("http://localhost:5000/api/getallgdv");
    console.log("Gói khám từ API:", response.data);
    setData(response.data);
  };
  

  useEffect(() => {
    loadData();
  }, []);

  const generateContextText = (data) => {
    if (!Array.isArray(data) || data.length === 0) return "Không có gói khám nào.";
  
    return data.map((pkg, index) => {
      const name = pkg.ten_dich_vu || `Gói khám #${index + 1}`;
      const desc = pkg.mo_ta || "Không có mô tả";
      const price = pkg.gia ? `${pkg.gia.toLocaleString("vi-VN")} VND` : "Chưa có giá";
      const note1 = pkg.thong_so_1 || "";
      const note2 = pkg.thong_so_2 || "";
      const promotion = pkg.uu_dai ? `Ưu đãi gói khám: ${pkg.uu_dai}` : "";
      const alert = pkg.thong_bao ? `Thông tin : ${pkg.thong_bao}` : "";
  
      return `- ${name}:\n  Mô tả: ${desc}\n  Giá: ${price}\n  ${note1}\n  ${note2}\n  ${promotion}\n  ${alert}`;
    }).join("\n\n");
  };

  
//Mỗi lần message thay đổi sẽ lưu thêm
  useEffect(() => {
    localStorage.setItem("ai-saved-chats", JSON.stringify(chats));
  }, [chats]);

//Set màu cho theme nếu người dùng lựa chọn
  useEffect(() => {
    localStorage.setItem("ai-themeColor", theme);
    document.body.classList.toggle("light_mode", theme === "light_mode");
  }, [theme]);


//Hàm submit message

const handleSendMessage = async (message) => {
  if (!message.trim() || isLoading) return;

  setChats((prevChats) => [
    ...prevChats,
    { text: message, type: "outgoing" },
  ]);
  setUserMessage("");
  setIsLoading(true);

  const isRelatedToClinic = (text) => {
    const keywords = ["gói khám", "dịch vụ khám", "khám bệnh", "phòng khám", "khám sức khỏe"];
    const lowerText = text.toLowerCase();
    return keywords.some((keyword) => lowerText.includes(keyword));
  };

  // Tạo prompt tuỳ theo nội dung câu hỏi
  const promptParts = isRelatedToClinic(message)
    ? [
        {
          role: "user",
          parts: [
            {
              text: `Dưới đây là danh sách các gói khám hiện có:\n${generateContextText(data)}\n\nHãy sử dụng thông tin này để trả lời câu hỏi tiếp theo khi khách hàng hỏi về dịch vụ khám hoặc gói khám bệnh.`,
            },
          ],
        },
        {
          role: "user",
          parts: [{ text: message }],
        },
      ]
    : [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: promptParts,
      }),
    });

    const resData = await response.json();
    const aiMessage =
      removeAsterisks(resData?.candidates?.[0]?.content?.parts?.[0]?.text) ||
      "Lỗi phản hồi từ AI.";

    setChats((prevChats) => [
      ...prevChats,
      { text: aiMessage, type: "incoming" },
    ]);
  } catch (error) {
    setChats((prevChats) => [
      ...prevChats,
      {
        text: "Không thể phản hồi, vui lòng thử lại.",
        type: "incoming",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

//Hàm gửi text gợi ý đến api gemini
  const handleSuggestionClick = (text) => {
    setUserMessage(text);
    handleSendMessage(text);
    setShowSuggestions(false); // Ẩn danh sách gợi ý
  };

//Hàm xử lý đổi màu
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark_mode" ? "light_mode" : "dark_mode"));
  };

//Hàm xóa nội dung chat cùng AI
  const deleteAllChats = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?")) {
      setShowSuggestions(true);
      setChats([]);
      localStorage.removeItem("ai-saved-chats");
    }
  };

//Hàm cắt chuỗi message AI
  function removeAsterisks(text) {
    return text.replace(/\*/g, "").trim(); // Loại bỏ dấu * và cắt khoảng trắng thừa
  }
 
  return (
    <div id="ai-chat">
      <div className="ai-all">
        {/* AI Suggestion List */}
        {showSuggestions && ( // Hiển thị gợi ý nếu `showSuggestions` là true
          <ul className="ai-suggestion-list">
            {[
              "Nếu tôi bị ho cần điều trị như thế nào để tình hình sức khỏe được cải thiện tốt hơn?",
              "Tôi cảm thấy hơi mệt mỏi tôi nên làm gì?",
              "Bạn có thể tư vấn giúp tôi kế hoạch giảm cân?",
              "Phòng khám hiện đang cung cấp những gói khám nào cho nam giới?",
            ].map((suggestion, index) => (
              <li
                key={index}
                className="ai-suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <h4 className="ai-text">{suggestion}</h4>
                <span className="ai-icon material-symbols-rounded">draw</span>
              </li>
            ))}
          </ul>
        )}

        {/* AI Chat List */}
        <div className="ai-chat-list">
          <div className="ai-chat-grid">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`ai-message ${chat.type === "outgoing" ? "outgoing" : "incoming"}`}
              >
                <div className="ai-message-content">
                  <img
                    className="ai-avatar"
                    src={
                      chat.type === "outgoing"
                        ? "https://img.icons8.com/?size=100&id=ScJCfhkd77yD&format=png&color=000000"
                        : "https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                    }
                    alt={chat.type === "outgoing" ? "User avatar" : "AI avatar"}
                  />
                  <p className="ai-text">{chat.text}</p>
                </div>
                {chat.type === "incoming" && (
                  <span
                    onClick={() => navigator.clipboard.writeText(chat.text)}
                    className="ai-icon material-symbols-rounded"
                  >
                    content_copy
                  </span>
                )}
              </div>
            ))}
            {/* Hiển thị trạng thái đang tải */}
            {isLoading && (
              <div className="ai-message incoming">
                <div className="ai-message-content">
                  <img
                    className="ai-avatar"
                    src="https://img.icons8.com/?size=100&id=kTuxVYRKeKEY&format=png&color=000000"
                    alt="AI avatar"
                  />
                  <p className="ai-text">AI đang phản hồi...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Typing Area */}
        <div className="ai-typing-area">
          <form
            className="ai-typing-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(userMessage);
            }}
          >
            <div className="ai-input-wrapper">
              <input
                type="text"
                placeholder="Nhập câu hỏi của bạn tại đây..."
                className="ai-typing-input"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                required
              />
              <button
                type="submit"
                id="send-ai-message-button"
                className="ai-icon material-symbols-rounded"
              >
                send
              </button>
            </div>
            <div className="ai-action-buttons">

              <span
            
              id="add-image-button"
              className="ai-icon material-symbols-rounded"
             
            >
              image
            </span>

              <span
                id="theme-ai-toggle-button"
                className="ai-icon material-symbols-rounded"
                onClick={toggleTheme}
              >
                {theme}
              </span>

              <span
                id="delete-ai-chat-button"
                className="ai-icon material-symbols-rounded"
                onClick={deleteAllChats}
              >
                delete
              </span>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAIApp;
