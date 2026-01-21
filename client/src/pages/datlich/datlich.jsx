import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate cho điều hướng
import { useUser } from "../../until/userContext";


function AppointmentForm() {
  const { user } = useUser();
  const [departments, setDepartments] = useState([]); // State cho danh sách chuyên khoa
  const [doctors, setDoctors] = useState([]); // State cho bác sĩ dựa trên chuyên khoa đã chọn
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const[appointmentTime , setAppointmentTime] = useState('');
  
  const navigate = useNavigate(); // Sử dụng useNavigate cho điều hướng

  // Lấy danh sách chuyên khoa từ API khi component được mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getalldmkhoa');
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data); // Cập nhật state với dữ liệu đã lấy
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  // Lấy danh sách bác sĩ dựa trên chuyên khoa đã chọn
  useEffect(() => {
    if (selectedSpecialty) {
      const fetchDoctors = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/getdoctors/${selectedSpecialty}`);
          if (!response.ok) throw new Error('Failed to fetch doctors');
          const data = await response.json();
          setDoctors(data); // Cập nhật state bác sĩ dựa trên chuyên khoa đã chọn
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]); // Reset danh sách bác sĩ nếu không chọn chuyên khoa
    }
  }, [selectedSpecialty]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
    alert("Vui lòng đăng nhập để đặt dịch vụ!");
    navigate("/DangNhap");
    return; // Dừng thực thi hàm nếu chưa đăng nhập
    }
    // Kiểm tra dữ liệu đã đủ chưa
    if (!selectedDoctor || !selectedSpecialty || !appointmentDate || !healthCondition || !appointmentTime) {
      alert('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.');
      return; // Không tiếp tục nếu có trường dữ liệu thiếu
    }
    // Lưu dữ liệu vào local storage
    const formData = {
      selectedDoctor,
      selectedSpecialty,
      appointmentDate,
      healthCondition,
      appointmentTime
    };
    localStorage.setItem('appointmentData', JSON.stringify(formData)); // Lưu dữ liệu vào local storage

    // Chuyển hướng đến trang đăng ký
    navigate('/xndatlich'); // Điều hướng đến trang đăng ký
  };

  return (
    <div className="form-container-dl">
      <h2>ĐĂNG KÝ KHÁM BỆNH</h2>
      <p>Quý khách hàng có nhu cầu đặt hẹn khám tại Hệ thống phòng khám đa khoa </p>

      <form onSubmit={handleSubmit} className="appointment-form-dl">
        <div className="form-group-dl">
          <label>Chọn loại dịch vụ khám</label>
          <div className="radio-group-dl">
            <label>
              <input type="radio" name="service" value="Khám trong giờ" /> Khám trong giờ
            </label>
            <label>
              <input type="radio" name="service" value="Khám ngoài giờ" /> Khám ngoài giờ
            </label>
            <label>
              <input type="radio" name="service" value="Khám online" /> Khám online
            </label>
          </div>
        </div>

        <div className="form-group-dl">
          <label>Chọn chuyên khoa</label>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">-- Chọn chuyên khoa --</option>
            {departments.map((dept) => (
              <option key={dept.id_khoa} value={dept.id_khoa}>
                {dept.ten_khoa}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-dl">
          <label>Chọn bác sĩ</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((doctor) => (
              <option key={doctor.id_bac_si} value={doctor.id_bac_si} disabled={doctor.trang_thai !== 1} >
               {doctor.ho_ten} ({doctor.chuc_danh})  {(doctor.trang_thai) === 1 ? "" : "(Đang nghỉ phép)"}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-dl">
          <label>Chọn ngày - khung giờ muốn khám</label>
          <div className='form-group-dl-time'>
          <input  type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)}/>
        <div className='dl-time-date'>
        <select value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)}>
          <option value="">Chọn giờ khám</option>
          <option value="8:00">8:00 - Sáng</option>
          <option value="8:30">8:30</option>
          <option value="9:00">9:00</option>
          <option value="9:30">9:30</option>
          <option value="10:00">10:00</option>
          <option value="10:30">10:30</option>
          <option value="11:00">11:00</option>
          <option value="11:30">11:30</option>
          <option value="13:30">13:30 - Chiều</option>
          <option value="14:00">14:00</option>
          <option value="14:30">14:30</option>
          <option value="15:00">15:00</option>
          <option value="15:30">15:30</option>
          <option value="16:00">16:00</option>
          <option value="16:30">16:30</option>
        </select>
            </div>
          </div>

        </div>

        <div className="form-group-dl">
          <label>Nhập vấn đề sức khỏe cần khám</label>
          <textarea
            placeholder="Nhập tình trạng sức khỏe của bạn"
            value={healthCondition}
            onChange={(e) => setHealthCondition(e.target.value)}
          ></textarea>
        </div>

        <div className="button-group-dl">
          <button type="submit" className="submit-btn-dl">TIẾP THEO</button>
        </div>
      </form>
    </div>
  );
}

export default AppointmentForm;
