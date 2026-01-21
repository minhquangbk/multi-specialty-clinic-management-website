import React, { Fragment, useState ,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../until/userContext';

  export default function Sizebar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [idUser, setIdUser] = useState(null); // ID thực tế: bác sĩ hoặc bệnh nhân
  const { user } = useUser(); // Lấy thông tin tài khoản đăng nhập

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  useEffect(() => {
    const fetchIdUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/getinfobyiduser/${user.id}`);
        const data = await res.json();

        if (data && data.id_user) {
          setIdUser(data.id_user); // Lưu id_user (bác sĩ hoặc bệnh nhân)
        }
      } catch (error) {
        console.error('Lỗi khi lấy id_user:', error);
      }
    };

    if (user?.id) {
      fetchIdUser();
    }
  }, [user]);

  return (
    <Fragment>
      <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

        {user?.type === 0 && (
        <>
       <a className="sidebar-brand d-flex align-items-center justify-content-center" href="#">
          <div className="sidebar-brand-icon">
            <i className="fas fa-hospital"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Quản Lý</div>
        </a>
        <hr className="sidebar-divider my-0" />

        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Thống kê</span>
          </Link>
        </li>
        <hr className="sidebar-divider" />

        {/* Dịch Vụ Y Tế Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            onClick={() => toggleMenu('medicalServices')}
            href="#!"
          >
            <i className="fas fa-calendar"></i>
            <span>Dịch Vụ Y Tế</span>
          </a>
          <div
            className={`collapse ${activeMenu === 'medicalServices' ? 'show' : ''}`}
            aria-labelledby="headingMedicalServices"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/Indexgdv">Gói dịch vụ</Link>
              <Link className="collapse-item" to="/IndexTVT">Vật tư y tế</Link>
            </div>
          </div>
        </li>

        {/* Lịch Khám */}
        <li className="nav-item">
          <Link className="nav-link" to="/Indexlichkham">
            <i className="far fa-calendar-check"></i>
            <span>Lịch Khám</span>
          </Link>
        </li>

         {/* Phòng khám */}
         <li className="nav-item">
          <Link className="nav-link" to="/IndexPhongKham">
            <i className="fas fa-hospital"></i>
            <span>Phòng khám</span>
          </Link>
        </li>

        {/* Quản Lý Nhân Sự Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            onClick={() => toggleMenu('personnelManagement')}
            href="#!"
          >
            <i className="fas fa-user-check"></i>
            <span>Quản Lý Nhân Sự</span>
          </a>
          <div
            className={`collapse ${activeMenu === 'personnelManagement' ? 'show' : ''}`}
            aria-labelledby="headingPersonnelManagement"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/IndexBacSi">Bác sĩ</Link>
              <Link className="collapse-item" to="/Indexdm">Khoa</Link>
              <Link className="collapse-item" to="/Indextrinhdobs">Trình độ bác sĩ</Link>
              <Link className="collapse-item" to="/IndexNghiPhep">Nghỉ phép</Link>
            </div>
          </div>
        </li>

        {/* Hồ Sơ Bệnh Nhân Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            onClick={() => toggleMenu('patientRecords')}
            href="#!"
          >
            <i className="fas fa-user-friends"></i>
            <span>Hồ Sơ Bệnh Nhân</span>
          </a>
          <div
            className={`collapse ${activeMenu === 'patientRecords' ? 'show' : ''}`}
            aria-labelledby="headingPatientRecords"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/Indexbenhnhan">Bệnh nhân</Link>
              <Link className="collapse-item" to="/Indexhosobenhan">Hồ sơ khám bệnh</Link>
            </div>
          </div>
        </li>

        {/* Kho Vận Collapse Menu */}
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            onClick={() => toggleMenu('inventory')}
            href="#!"
          >
            <i className="fas fa-truck"></i>
            <span>Kho Vận</span>
          </a>
          <div
            className={`collapse ${activeMenu === 'inventory' ? 'show' : ''}`}
            aria-labelledby="headingInventory"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/Indexkhohang">Kho hàng</Link>
              <Link className="collapse-item" to="/Indexhoadonnhap">Hóa đơn nhập</Link>
            </div>
          </div>
        </li>

        {/* Tài Khoản và Cài Đặt */}
        <li className="nav-item">
          <Link className="nav-link" to="/Indextaikhoan">
            <i className="fas fa-fw fa-cog"></i>
            <span>Tài khoản</span>
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            onClick={() => toggleMenu('settings')}
            href="#!"
          >
            <i className="fas fa-fw fa-wrench"></i>
            <span>Cài đặt</span>
          </a>
          <div
            className={`collapse ${activeMenu === 'settings' ? 'show' : ''}`}
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <Link className="collapse-item" to="/slider">Slider</Link>
              <Link className="collapse-item" to="/qlyblog">Blog</Link>
            </div>
          </div>
        </li>
        </>
        )}

        {user?.type === 1 && (
         <>
        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="#">
          <div className="sidebar-brand-icon">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="sidebar-brand-text mx-3">Bác sĩ</div>
        </a>
        <hr className="sidebar-divider my-0" />
            <li className="nav-item">
                    <Link className="nav-link" to="/Thongkebacsi">
                      <i className="fas fa-fw fa-tachometer-alt"></i>
                      <span>Thống kê</span>
                    </Link>
              </li>

            <li className="nav-item">
              <Link className="nav-link" to={`/ProfileBacSi/${idUser}`}>
                <i className="fas fa-user-md"></i> {/* Bác sĩ */}
                <span>Thông tin cá nhân</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="IndexNghiPhepBacSi">
                <i className="fas fa-calendar-times"></i> {/* Nghỉ phép */}
                <span>Xin nghỉ phép</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={`/IndexLichKhamBacSi/${idUser}`}>
                <i className="fas fa-stethoscope"></i> {/* Khám bệnh */}
                <span>Lịch khám bệnh</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to={`/IndexhosobenhanBacSi/${idUser}`}>
                <i className="fas fa-notes-medical"></i> {/* Hồ sơ bệnh án */}
                <span>Hồ sơ bệnh án</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/Capnhattaikhoan">
                <i className="fas fa-user-cog"></i> {/* Tài khoản */}
                <span>Tài khoản</span>
              </Link>
            </li>

        </>
        )}

        <hr className="sidebar-divider" />

        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
      </ul>
    </Fragment>
  );
}
