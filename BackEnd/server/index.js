const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // Địa chỉ React frontend
        methods: ["GET", "POST"]
    }
});

// Export router
const danhmuckhoaRoutes = require('./routes/danhmuckhoaRoute');
const nhanvienRoutes = require('./routes/bacsiRoute');
const khachhangRoutes = require('./routes/benhnhanRoute');
const khohangRoutes = require('./routes/khohangRoute');
const hoadonlichkhamRoutes = require('./routes/hoadonlichkhamRoute');
const hdnRoutes = require('./routes/hoadonnhapRoute');
const chitietlichkhamRoutes = require('./routes/chitietlichkhamRoutes');
const taikhoanRoutes = require('./routes/taikhoanRoute');
const datdichvukhamRoutes = require('./routes/datdichvukhamRoute');
const datlichkhambenhRoutes = require('./routes/datlichkhamRoute');
const hosobenhanRoutes = require('./routes/hosobenhnhanRoute');
const goidichvukhamRoutes = require('./routes/goidichvukhambenhRoute');
const thuocVTRoutes = require('./routes/thuocvattuRoute');
const trinhdoBSRoutes = require('./routes/trinhdobacsiRoute');
const phongkhamRoutes = require('./routes/phongkhamRoute');
const tinnhanRoutes = require('./routes/tinnhanRoute');
const vnpayRoutes = require('./routes/vnpayRoute');
const nghiphepRoutes = require('./routes/nghiphepRoute');


// Cấu hình middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sử dụng router
app.use(danhmuckhoaRoutes);
app.use(nhanvienRoutes);
app.use(khachhangRoutes);
app.use(khohangRoutes);
app.use(goidichvukhamRoutes);
app.use(hosobenhanRoutes);
app.use(hoadonlichkhamRoutes);
app.use(hdnRoutes);
app.use(chitietlichkhamRoutes);
app.use(taikhoanRoutes);
app.use(datdichvukhamRoutes);
app.use(datlichkhambenhRoutes);
app.use(thuocVTRoutes);
app.use(trinhdoBSRoutes);
app.use(phongkhamRoutes);
app.use(tinnhanRoutes);
app.use(vnpayRoutes);
app.use(nghiphepRoutes);

// WebSocket - Khi có client kết nối
io.on("connection", (socket) => {
    console.log("Có người dùng kết nối:", socket.id);

    socket.on("sendMessage", (message) => {
        console.log("Tin nhắn nhận được:", message);
        io.emit("newMessage", message); // Phát tin nhắn đến tất cả client
    });

    socket.on("disconnect", () => {
        console.log("Người dùng đã ngắt kết nối:", socket.id);
    });
});

// Lắng nghe server
server.listen(5000, () => {
    console.log("Server is running on port 5000");
});
