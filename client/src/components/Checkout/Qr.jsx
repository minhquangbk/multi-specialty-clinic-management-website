import React, { useState, useEffect, useContext } from 'react';
import './Qr.css';
import { HashLoader } from "react-spinners";
import  { LoadData } from '../../until/cartactive';
import { VisibilityContext } from '../../until/visibleContext';
const QRPayment = () => {

  LoadData();

  const [isModalVisible, setIsModalVisible] = useState(true); // Kiểm soát hiển thị modal
  const [isLoaderVisible, setIsLoaderVisible] = useState(false); // Kiểm soát hiển thị loader
  const { isVisible, setIsVisible } = useContext(VisibilityContext);// lấy giá trị các biến từ usecontext

  useEffect(() => {
    
    const modalTimeout = setTimeout(() => {
      setIsModalVisible(false); // Ẩn modal sau 15 giây
      setIsLoaderVisible(true); // Hiển thị loader sau khi ẩn modal
    }, 25000);

    const loaderTimeout = setTimeout(() => {
      setIsVisible(false); // Ẩn toàn bộ component
    }, 30000);

    // Cleanup timeout khi component bị unmount
    return () => {
      clearTimeout(modalTimeout);
      clearTimeout(loaderTimeout);
    };
    
  }, [setIsVisible]);

  if (!isVisible) {
    return null; // Không render gì nếu isVisible là false
  }

  return (
    <div className='vietqr'>
      {isModalVisible && (
        <div className="vietqr-modal">
          <h2 className="vietqr-title">Mã VietQR thanh toán</h2>
          <div className="vietqr-content">
            <div className="vietqr-frame">
              <h3 className="vietqr-header">Mở Ứng Dụng Ngân Hàng Quét QRCode</h3>
              <img
                src="../Images/QRHung.jpg" // Thay bằng link QR code thực tế
                alt="VietQR Code"
                className="vietqr-image"
              />
              <div className="vietqr-info">
                <p  className='vietqr-info-block'><strong>Số tiền:</strong><p className='total-price'></p></p>

                <p><strong>Tên chủ TK:</strong> Đinh Việt Hùng</p>
                <p><strong>Số TK:</strong> 0343493518</p>
              </div>
              <p className="vietqr-footer">
                Giải pháp được cung cấp trên nền tảng <strong>Sapo</strong>
              </p>
            </div>
            <button className="vietqr-print-button">In nhanh mã</button>
          </div>
        </div>
      )}

      <div className='qr-delete' onClick={() => setIsVisible(false)}>
        <img src="https://img.icons8.com/?size=100&id=9433&format=png&color=000000" alt="" />
      </div>

      {isLoaderVisible && (
        <div className='vietqr-reload'>
          <HashLoader
            color="#89ea98"
            cssOverride={{}}
            loading
            size={90}
            speedMultiplier={1}
          />
        </div>
      )}

      <div className='vietqr-success'>
        {/* Các nội dung thành công có thể được thêm vào đây */}
      </div>
    </div>
  );
};

export default QRPayment;
