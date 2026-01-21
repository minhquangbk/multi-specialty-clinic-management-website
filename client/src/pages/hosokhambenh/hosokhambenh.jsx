import React, { useState, useEffect } from 'react';
import { useUser } from '../../until/userContext';

const MedicalChart = () => {
const [patientInfo, setPatientInfo] = useState({});
const [medicalRecords, setMedicalRecords] = useState([]);
const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
const recordsPerPage = 1; // 1 lần khám mỗi trang
const { user } = useUser(); // Lấy thông tin người dùng từ context
console.log(patientInfo,medicalRecords)

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthNames = [
    "tháng 1", "tháng 2", "tháng 3", "tháng 4", 
    "tháng 5", "tháng 6", "tháng 7", "tháng 8", 
    "tháng 9", "tháng 10", "tháng 11", "tháng 12"
  ];

  return `${day} ${monthNames[month - 1]} năm ${year}`;
};

useEffect(() => {
  const fetchMedicalRecords = async () => {
    try {
      // Gọi API để lấy id_user (tức là id_benh_nhan)
      const infoRes = await fetch(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
      const infoData = await infoRes.json();

      if (!infoData || !infoData.id_user) {
        console.error('Không tìm thấy id_user tương ứng.');
        return;
      }

      const idUser = infoData.id_user;
      console.log(idUser)

      // Gọi API lấy hồ sơ bệnh án theo id_user
      const response = await fetch(`http://localhost:5000/patient/${idUser}/medical-records`);
      const data = await response.json();

      setPatientInfo(data.patientInfo);
      setMedicalRecords(data.medicalRecords);

    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ bệnh án:', error);
    }
  };

  if (user && user.id) {
    fetchMedicalRecords();
  }
}, [user]);
 // Chạy lại effect khi user thay đổi

   // Tính toán chỉ số trang
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = medicalRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(medicalRecords.length / recordsPerPage);

  return (
    <div className="medical-chart">

      {totalPages > 1 && (
        <div
          className="pagination-medical"
          style={{
            display: 'flex',
            justifyContent: 'flex-start', // Căn trái
            marginBottom: '20px',
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                borderRadius: '5px',
                backgroundColor: currentPage === i + 1 ? '#007bff' : '#f0f0f0',
                color: currentPage === i + 1 ? '#fff' : '#000',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="clinic-header">
        <img 
          src="../Images/Untitled-1.png" 
          alt="Clinic Logo" 
          style={{
            width: '90px',
            height: '60px',
            marginRight: '15px',
            borderRadius: '50%', // nếu bạn muốn logo hình tròn
          }}
        />
        <h1 className="clinic-name">Phòng khám đa khoa </h1>
      </div>

      <h2 className="title">Hồ Sơ Khám Bệnh</h2>
      
      <div className="section">
        <h3>Thông tin bệnh nhân</h3>
        <div className="row">
          <label>Họ và tên:</label>
          <input type="text" value={patientInfo.ho_ten || ''} readOnly />
        </div>
        <div className="row">
          <label>Số điện thoại:</label>
          <input type="text" value={patientInfo.so_dien_thoai || ''} readOnly />
        </div>
        <div className="row">
          <label>Thông tin bảo hiểm:</label>
          <input type="text" value={'Bảo hiểm y tế DKPN'} readOnly />
        </div>
        <div className="row">
          <label>Giới tính:</label>
          <input type="text" value={(patientInfo.gioi_tinh) === 1 ?"Nam" : "Nữ" || ''} readOnly />
        </div>
        <div className="row">
          <label>Ngày sinh:</label>
          <input type="text" value={formatDate(patientInfo.ngay_sinh) || ''} readOnly />
        </div>
        <div className="row">
          <label>Quê quán:</label>
          <input type="text" value={patientInfo.dia_chi || ''} readOnly />
        </div>
        <div className="row">
          <label>Tình trạng sức khỏe hiện tại:</label>
          <input type="text" value={'Bệnh nhân có biểu hiện ho nhẹ'} readOnly />
        </div>
      </div>

      {currentRecords.length > 0 && (
        <>
          <div className="section">
            <h3>Ngày khám: {formatDate(currentRecords[0].ngay_lap)}</h3>
          </div>
          <div className="section">
            <h3>Triệu chứng / lý do khám</h3>
            <textarea value={currentRecords[0].trieu_chung || ''} readOnly placeholder="Chưa có thông tin" />
          </div>
          <div className="section">
            <h3>Tiền sử bệnh</h3>
            <textarea value={currentRecords[0].tien_su_benh || ''} readOnly placeholder="Chưa có thông tin" />
          </div>
          <div className="section">
            <h3>Chẩn đoán</h3>
            <textarea value={currentRecords[0].chan_doan || ''} readOnly placeholder="Chưa có thông tin" />
          </div>
          <div className="section">
            <h3>Phương pháp điều trị</h3>
            <textarea value={currentRecords[0].phuong_phap_dieu_tri || ''} readOnly placeholder="Chưa có thông tin" />
          </div>
          <div className="section">
            <h3>Ghi chú</h3>
            <textarea value={currentRecords[0].ghi_chu || ''} readOnly placeholder="Chưa có thông tin" />
          </div>
        </>
      )}

    </div>

    
  );
};

export default MedicalChart;
