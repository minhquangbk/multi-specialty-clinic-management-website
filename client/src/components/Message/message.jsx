import React, { useState , useEffect,useRef} from 'react';
import axios from 'axios';
import moment from 'moment';
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

export default function Message() {

  const [messages, setMessages] = useState([
  ]);

  const messagesEndRef = useRef(null);
  

  const loadData = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/getallmessages");
        setMessages(response.data);
    } catch (error) {
        console.error("Error fetching messages data:", error);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(newImages);
  };
  

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nếu newMessage là mảng, lấy phần tử đầu tiên
    let messageContent = Array.isArray(newMessage) ? newMessage[0] : newMessage;
    
    // Đảm bảo messageContent là chuỗi trước khi gọi trim()
    const trimmedMessage = typeof messageContent === 'string' ? messageContent.trim() : "";

    if (trimmedMessage) {
        console.log('message:', trimmedMessage);

        const data = {
            id_nguoi_gui: 1,
            id_nguoi_nhan: 1,
            type_nguoi_gui: 'patient',
            noi_dung: trimmedMessage, // Gửi nội dung đã loại bỏ khoảng trắng
            tg_gui: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        try {
            await axios.post('http://localhost:5000/api/createmessages', data);
            socket.emit("sendMessage", data);
            setNewMessage('');
            setSelectedImages([]); // Reset input sau khi gửi tin nhắn
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        }
    }
};


const [selectedImages, setSelectedImages] = useState([]);
const fileInputRef = useRef(null);

const handleImageChange = (event) => {
  const files = Array.from(event.target.files);
  const imagePaths = files.map(file => `/images/${file.name}`);
  setSelectedImages(files);
  setNewMessage(imagePaths);
};

const handleButtonClick = () => {
  fileInputRef.current.click();
};

  useEffect(()=> {
    // Lắng nghe tin nhắn mới từ server
    socket.on("newMessage", (messages) => {
        setMessages((prevMessages) => [...prevMessages, messages]);
    });

    loadData();

    return () => {
        socket.off("newMessage");
    };
    
  },[])

  const isDifferentTime = (prevTime, currentTime) => {
    if (!prevTime || !currentTime) return true;
    const prevDate = new Date(prevTime);
    const currentDate = new Date(currentTime);
    
    // Hiển thị thời gian nếu chênh lệch trên 5 phút
    return Math.abs(currentDate - prevDate) > 5 * 60 * 1000;
};
const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>

      <div className="message">
        <div className="message-header">
          <span>
            <svg color="#111111" viewBox="0 0 32 32" aria-hidden="true" className="lc-1mpchac">
              <path d="M8,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S9.1,18,8,18z M16,18c-1.1,0-2-0.9-2-2s0.9-2,2-2 s2,0.9,2,2S17.1,18,16,18z M24,18c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S25.1,18,24,18z"></path>
            </svg>
          </span>
          <h3>Chat Cùng Bác Sĩ</h3>
          <span className="hide-message">
            <svg color="inherit" viewBox="0 0 32 32" aria-hidden="true" className="lc-1mpchac">
              <path d="M11,22c-0.6,0-1-0.4-1-1s0.4-1,1-1h15c0.6,0,1,0.4,1,1s-0.4,1-1,1H11z"></path>
            </svg>
          </span>
        </div>

        <div className="message-body">
          {messages.map((message, index) => (
            <React.Fragment key={message.idtin_nhan}>
                {/* Hiển thị thời gian nếu tin nhắn trước đó cách xa tin nhắn hiện tại */}
                {(index === 0 || isDifferentTime(messages[index - 1].tg_gui, message.tg_gui)) && (
                    <div className="message-time">{formatTime(message.tg_gui)}</div>
                )}

                <div className={`message-item ${message.type_nguoi_gui || "default"}`}>
                    {message.noi_dung?.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                        <img src={message.noi_dung} alt="Hình ảnh" className="message-image" />
                    ) : (
                        <p>{message.noi_dung || "Tin nhắn trống"}</p>
                    )}
                </div>
            </React.Fragment>
          ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="message-footer">
        <button
            type="submit"
            className="send-button-use"
            style={{ backgroundColor: "white", border: "none",marginLeft:"10px" }}
          >
           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5Z" fill="#000000"></path> <path d="M6.25 11.8438V12C6.25 13.525 6.8558 14.9875 7.93414 16.0659C9.01247 17.1442 10.475 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0659 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V22C13.25 22.5523 12.8023 23 12.25 23H11.75C11.1977 23 10.75 22.5523 10.75 22V20.1548C9.02471 19.8903 7.41579 19.0831 6.16637 17.8336C4.61919 16.2865 3.75 14.188 3.75 12V11.8438C3.75 11.2915 4.19772 10.8438 4.75 10.8438H5.25C5.80228 10.8438 6.25 11.2915 6.25 11.8438Z" fill="#000000"></path> </g></svg>

          </button>
        <div>
          <button onClick={handleButtonClick} className="send-button-use" style={{ backgroundColor: "white", border: "none"}}>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fill="#000000" d="M96 896a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h832a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32H96zm315.52-228.48-68.928-68.928a32 32 0 0 0-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 0 0-49.216 0L458.752 665.408a32 32 0 0 1-47.232 2.112zM256 384a96 96 0 1 0 192.064-.064A96 96 0 0 0 256 384z"></path>
              </g>
            </svg>

          </button>

          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageChange} 
            ref={fileInputRef} 
            style={{ display: 'none' }}
          />
  
        </div>
        <div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedImages.map((image, index) => (
              <div key={index} className="image-container">
                <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="preview-image" style={{ width: '100px', height: '100px', margin: '5px' }} />
                <button className="delete-button" onClick={() => handleRemoveImage(index)}>
                  ✖
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="input-container">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              cols="30"
              rows="1"
              placeholder="Viết tin nhắn"
              className="message-input"
            ></textarea>
          </form>
        </div>
    

          <button
            type="submit"
            className="send-button"
            onClick={sendMessage}
            style={{ backgroundColor: "white", border: "none" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 64 64" id="send">
            <defs>
              <clipPath id="a">
                <rect width="64" height="64"></rect>
              </clipPath>
            </defs>
            <g clip-path="url(#a)">
              <path d=" M 8.216 36.338 L 26.885 32.604 C 28.552 32.271 28.552 31.729 26.885 31.396 L 8.216 27.662 C 7.104 27.44 6.021 26.356 5.799 25.245 L 2.065 6.576 C 1.731 4.908 2.714 4.133 4.259 4.846 L 61.228 31.139 C 62.257 31.614 62.257 32.386 61.228 32.861 L 4.259 59.154 C 2.714 59.867 1.731 59.092 2.065 57.424 L 5.799 38.755 C 6.021 37.644 7.104 36.56 8.216 36.338 Z "></path>
            </g>
          </svg>

          </button>
        </div>
      </div>

    </div>
  );
}
