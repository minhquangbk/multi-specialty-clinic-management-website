import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { useUser } from '../../until/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { updateUser , user } = useUser();
  const navigate = useNavigate();

  const logout = () => {
  if (window.confirm("Bạn có muốn đăng xuất không ?")) {

    localStorage.removeItem('token');
    updateUser(null); // hoặc reset state người dùng
    navigate('/login');
    window.location.reload();
 }

};

  return (
<Fragment>
<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

{/* <!-- Sidebar Toggle (Topbar) --> */}
<form className="form-inline">
    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
        <i className="fa fa-bars"></i>
    </button>
</form>


{/* <!-- Topbar Navbar --> */}
<ul className="navbar-nav ml-auto">

    {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
    <li className="nav-item dropdown no-arrow d-sm-none">
        <a className="nav-link dropdown-toggle" href="#" id="searchDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-search fa-fw"></i>
        </a>
        {/* <!-- Dropdown - Messages --> */}
        <div className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in" aria-labelledby="searchDropdown">
            <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                    <input type="text" className="form-control bg-light border-0 small" placeholder="Search for..." aria-label="Search" aria-describedby="basic-addon2"/>
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button">
                            <i className="fas fa-search fa-sm"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </li>

    {/* <!-- Nav Item - Alerts --> */}
    <li className="nav-item dropdown no-arrow mx-1">
    <a
        className="nav-link dropdown-toggle"
        href="#"
        id="alertsDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
        <i className="fas fa-bell fa-fw"></i>
        <span className="badge badge-danger badge-counter">5</span>
    </a>

    <div
        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
        aria-labelledby="alertsDropdown"
    >
        <h6 className="dropdown-header">Thông báo</h6>

        {/* 1. Có hồ sơ mới */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="mr-3">
            <div className="icon-circle bg-primary">
            <i className="fas fa-file-medical text-white"></i>
            </div>
        </div>
        <div>
            <div className="small text-gray-500">21/05/2025</div>
            <span className="font-weight-bold">Hồ sơ khám mới từ bệnh nhân Nguyễn Văn Hải.</span>
        </div>
        </a>

        {/* 2. Xác nhận đặt lịch */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="mr-3">
            <div className="icon-circle bg-success">
            <i className="fas fa-calendar-check text-white"></i>
            </div>
        </div>
        <div>
            <div className="small text-gray-500">20/05/2025</div>
            Lịch hẹn với bệnh nhân Trần Thị B đã được xác nhận.
        </div>
        </a>

        {/* 3. Hủy lịch khám */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="mr-3">
            <div className="icon-circle bg-warning">
            <i className="fas fa-calendar-times text-white"></i>
            </div>
        </div>
        <div>
            <div className="small text-gray-500">19/05/2025</div>
            Bệnh nhân Lê Văn C đã hủy lịch khám ngày 22/05.
        </div>
        </a>

        {/* 4. Thiết bị cần bảo trì */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="mr-3">
            <div className="icon-circle bg-danger">
            <i className="fas fa-tools text-white"></i>
            </div>
        </div>
        <div>
            <div className="small text-gray-500">18/05/2025</div>
            Máy xét nghiệm máu cần được bảo trì định kỳ.
        </div>
        </a>

        {/* 5. Cập nhật thuốc tồn kho */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="mr-3">
            <div className="icon-circle bg-info">
            <i className="fas fa-pills text-white"></i>
            </div>
        </div>
        <div>
            <div className="small text-gray-500">17/05/2025</div>
            Thuốc Paracetamol đã giảm xuống dưới mức tồn kho tối thiểu.
        </div>
        </a>

        <a className="dropdown-item text-center small text-gray-500" href="#">
        Hiện tất cả thông báo
        </a>
    </div>
    </li>

    {/* <!-- Nav Item - Messages --> */}
    <li className="nav-item dropdown no-arrow mx-1">
    <a
        className="nav-link dropdown-toggle"
        href="#"
        id="messagesDropdown"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >
        <i className="fas fa-envelope fa-fw"></i>
        <span className="badge badge-danger badge-counter">4</span>
    </a>

    <div
        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
        aria-labelledby="messagesDropdown"
    >
        <h6 className="dropdown-header">Tin nhắn thông báo</h6>

        {/* Tin nhắn 1 */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="dropdown-list-image mr-3">
            <img
            className="rounded-circle"
            src="../images/Bacsi11.jpg"
            alt="..."
            />
            <div className="status-indicator bg-success"></div>
        </div>
        <div className="font-weight-bold">
            <div className="text-truncate">
            Bệnh nhân Nguyễn Văn Ánh yêu cầu in kết quả xét nghiệm.
            </div>
            <div className="small text-gray-500">Lễ tân Hoa · 5 phút trước</div>
        </div>
        </a>

        {/* Tin nhắn 2 */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="dropdown-list-image mr-3">
            <img
            className="rounded-circle"
            src="../images/Bacsi8.jpg"
            alt="..."
            />
            <div className="status-indicator bg-warning"></div>
        </div>
        <div>
            <div className="text-truncate">
            Nhắc bác sĩ Khánh kiểm tra lại đơn thuốc của bệnh nhân Trần Thị B.
            </div>
            <div className="small text-gray-500">Y tá Linh · 30 phút trước</div>
        </div>
        </a>

        {/* Tin nhắn 3 */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="dropdown-list-image mr-3">
            <img
            className="rounded-circle"
            src="../images/benhnhan1.jpg"
            alt="..."
            />
            <div className="status-indicator bg-danger"></div>
        </div>
        <div>
            <div className="text-truncate">
            Hệ thống thu ngân báo lỗi, cần kiểm tra lại phần mềm hóa đơn.
            </div>
            <div className="small text-gray-500">Kỹ thuật viên Hùng · 1 giờ trước</div>
        </div>
        </a>

        {/* Tin nhắn 4 */}
        <a className="dropdown-item d-flex align-items-center" href="#">
        <div className="dropdown-list-image mr-3">
            <img
            className="rounded-circle"
            src="../images/Bacsi1.jpg"
            alt="..."
            />
            <div className="status-indicator bg-info"></div>
        </div>
        <div>
            <div className="text-truncate">
            Danh sách bệnh nhân hôm nay đã được cập nhật vào hệ thống.
            </div>
            <div className="small text-gray-500">Admin Hệ thống · 2 giờ trước</div>
        </div>
        </a>

        <a className="dropdown-item text-center small text-gray-500" href="#">
        Đọc thêm tin nhắn
        </a>
    </div>
    </li>


    <div className="topbar-divider d-none d-sm-block"></div>

    {/* <!-- Nav Item - User Information --> */}
    <li className="nav-item dropdown no-arrow">
    
        <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small"></span>
           <Link to="#">
                {user && (
                <img
                    className="img-profile rounded-circle"
                    src={user.anh_user || "/img/undraw_profile.svg"}
                    alt="Ảnh người dùng"
                />
                )}
            </Link>

        </a>
        {/* <!-- Dropdown - User Information --> */}
        <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">

            <a className="dropdown-item" href="#">
            <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
            {user ? user.name : 'Tài khoản'}
            </a>

            <a className="dropdown-item" href="#">
                <i className="fas fa-sliders-h fa-sm fa-fw mr-2 text-gray-400"></i>
                Cài đặt
            </a>

            <a className="dropdown-item" href="#">
                <i className="fas fa-clipboard-list fa-sm fa-fw mr-2 text-gray-400"></i>
                Hoạt động
            </a>

            <div className="dropdown-divider"></div>
            
            <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" onClick={logout}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Đăng xuất
            </a>

        </div>

    </li>

        
</ul>

</nav>
</Fragment>
  )
}
