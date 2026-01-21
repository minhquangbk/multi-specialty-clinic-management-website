import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HospitalInterface = () => {

    const [data, setData] = useState([]);
    const [doctorLevels, setdoctorLevels] = useState([]);
    const [doctorDepartment, setdoctorDepartment] = useState([]);

    //tạo usestate chứa list search
    const [searchParams, setSearchParams] = useState({
        searchTerm: "",
        id_khoa: "",
        gioi_tinh: "",
        id_bang_cap: "",
    });

    //load dữ liệu bác sĩ
    const loadData = async () => {
        const response = await axios.get("http://localhost:5000/api/getallbs");
        setData(response.data);
    };

    //load dữ liệu trình độ bác sĩ
    const loadLevel = async () => {
        const response = await axios.get("http://localhost:5000/api/getalltrinhdo");
        setdoctorLevels(response.data);
    };

    //load dữ liệu khoa bác sĩ
    const loadDepartment = async () => {
        const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
        setdoctorDepartment(response.data);
    };

    const handleSearch = async () => {
        const { searchTerm, id_khoa, gioi_tinh, id_bang_cap } = searchParams;
        const query = new URLSearchParams({
            searchTerm,
            id_khoa,
            gioi_tinh,
            id_bang_cap,
        }).toString();

        try {
            const response = await axios.get(`http://localhost:5000/api/searchdoctors?${query}`);
            setData(response.data);
        } catch (error) {
            console.error("Error searching data", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({ ...prev, [name]: value }));
    };

    const getEducationName = (id_bang_cap) => {
        const level = doctorLevels.find((item) => item.id_bang_cap === id_bang_cap);
        return level ? level.ten_bang_cap : "Không xác định";
    };

    useEffect(() => {
        loadData();
        loadLevel();
        loadDepartment();
    }, []);

    // Gọi API khi searchParams thay đổi, sử dụng debounce
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch();
        }, 500); // Chờ 500ms trước khi thực hiện tìm kiếm

        return () => clearTimeout(debounceTimeout); // Xóa timeout nếu searchParams thay đổi trước khi timeout hoàn tất
    }, [searchParams]);

    return (
        <div className="container-bs">
            <div className="header-bs">
                <p>
                    Phòng khám Đa khoa còn là nơi hội tụ của hơn 15 tiến sĩ, chuyên gia đầu ngành trong mọi lĩnh vực, 
                    phần lớn các chuyên gia đều đã và đang làm việc tại các bệnh viện lớn như Bệnh viện Bạch Mai, 
                    Bệnh viện 108, Bệnh viện 103, Bệnh viện Việt Đức, Bệnh viện Phụ sản Trung ương, 
                    Bệnh viện Nhi Trung ương, Bệnh viện Tai – Mũi – Họng Trung ương… và luôn hành nghề theo tiêu chí:
                </p>
                <blockquote>“Khám với chuyên gia – Tận tâm như người nhà”</blockquote>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    name="searchTerm"
                    onChange={handleInputChange}
                    placeholder="Tìm theo tên bác sĩ"
                    className="search-input"
                />
                <select
                    name="id_khoa"
                    className="specialty-select"
                    onChange={handleInputChange}
                >
                    <option value="">Chuyên khoa</option>
                    <option value="">Hiển thị tất cả chuyên khoa</option>
                    {doctorDepartment.map((dept) => (
                        <option key={dept.id_khoa} value={dept.id_khoa}>
                            {dept.ten_khoa}
                        </option>
                    ))}
                </select>
                <select
                    name="gioi_tinh"
                    className="gender-select"
                    onChange={handleInputChange}
                >
                    <option value="">Giới tính</option>
                    <option value="">Hiển thị tất cả giới tính</option>
                    <option value="1">Nam</option>
                    <option value="2">Nữ</option>
                </select>
                <select
                    name="id_bang_cap"
                    className="education-select"
                    onChange={handleInputChange}
                >
                    <option value="">Trình độ</option>
                    <option value="">Hiển thị tất cả trình độ</option>
                    {doctorLevels.map((level) => (
                        <option key={level.id_bang_cap} value={level.id_bang_cap}>
                            {level.ten_bang_cap}
                        </option>
                    ))}
                </select>
            </div>

            <div className="doctors-section">
                {data.map((item) => (
                    <div key={item.id_bac_si} className="doctor-card">
                        <img src={item.hinh_anh_bs} alt="" className="doctor-image" />
                        <p>Bác sĩ</p>
                        <h3>
                            {getEducationName(item.id_bang_cap)} - {item.ho_ten}
                        </h3>
                        <p>{item.chuc_danh} – {item.mo_ta}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalInterface;
