import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../until/userContext';
import axios from "axios"; 
import { LoadData } from '../../until/cartactive';
import React, { Fragment, useEffect, useState } from 'react';

export default function Navbar() {
    const { user, logoutUser } = useUser();
    const navigate = useNavigate();
    const handleLogout = () => {
        logoutUser();
        navigate('/');
        var list = JSON.parse(localStorage.getItem("cart")) || [];
        list = [];
            localStorage.setItem("cart", JSON.stringify(list));
            LoadData();
      };

      const [data , setData] = useState([]);

      const loadData = async() =>{
              const response = await axios.get("http://localhost:5000/api/getalldmkhoa");
              setData(response.data);
      };

      useEffect(()=>{
          loadData();
      },[]);
  return (

      <Fragment>
      <header className="site-header">
        
        <div className="topbar" style={{display: 'block'}}>
            <a href="">Giảm ngay 20% cho tất cả dịch vụ khám chữa bệnh tại phòng khám, giúp bạn an tâm hơn mà vẫn tiết kiệm chi phí!</a>
            <a href="Allsanpham.html"> "Đăng ký ngay"</a>

        </div>
        <div className="header">
            <div className="header-inner">

                <div className="header__logo">
                    <Link to="/">
                        <img src="../Images/Untitled-1.png" alt="logo-coolmate"/>
                    </Link>

                </div>
                <div className="header__navbar hide-on-mobile-tablet">

                    <ul className="header__navbar-list">
                        <li className="header__navbar-product">
                            <Link to="/bacsi" className="header__navbar-link">
                                Chuyên Khoa
                            </Link>
                            
                            <div className="header__navbar-product-menu-wrap">
                                <div className="header__navbar-product-menu">

                                    <div className="header__navbar-product-col">
                                        <a href="" className="header__navbar-product-heading">Các diện bệnh chính</a>
                                        <ul>
                                            <li>
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Bệnh nam khoa</p>
                                                    <p className="header__navbar-product-item-link-content">Hỗ trợ giảm giá sâu</p>
                                                </a>
                                            </li>  
                                            <li>
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Bệnh phụ khoa</p>
                                                    <p className="header__navbar-product-item-link-content">Bác sĩ ân cần khám chữa</p>
                                                </a>
                                            </li> 
                                            <li>
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Bệnh xã hội</p>
                                                    <p className="header__navbar-product-item-link-content">Thăm khám kịp thời giải quyết dứt điểm</p>
                                                </a>
                                            </li> 
                                            <li>
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Kế hoạch hóa<span className="hot-tag">HOT</span></p>
                                                    <p className="header__navbar-product-item-link-content">Giải pháp hiệu quả cho người mới lập gia đình</p>
                                                </a>
                                            </li>   
                                        </ul>
                                    </div>
                                    
                                    <div className="header__navbar-product-col">
                                        <a href="" className="header__navbar-product-heading">Danh mục khoa</a>
                                        
                                        <ul>
                                            {data.map((item)=>{
                                                return( 
                                                <li key={item.id_khoa} className="header__navbar-product-item ">
                                                    <a href="" className="header__navbar-product-item-link">
                                                        <p className="header__navbar-product-item-link-name">{item.ten_khoa}</p>
                                                    </a>
                                                </li>)
                                            })}
                                           
                                        </ul>
                                    </div>
                                    <div className="header__navbar-product-col">
                                        <a href="" className="header__navbar-product-heading">Xu hướng</a>
                                        <ul>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Chăm sóc sức khỏe cá nhân hóa <span className="new-tag">New</span></p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Y tế từ xa </p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Chăm sóc sức khỏe tinh thần<span className="sale-tag">New</span></p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name"> Dinh dưỡng và chăm sóc phòng ngừa</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="header__navbar-product-col">
                                        <a href="" className="header__navbar-product-heading">Nhu cầu</a>
                                        <ul>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Tăng cường đề kháng</p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Tăng cân</p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Phòng ngừa bệnh tật</p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Chăm sóc sức khỏe toàn diện</p>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="header__navbar-product-col">
                                        <a href="" className="header__navbar-product-heading">Công nghệ</a>
                                        <ul>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">SKD</p>
                                                    <p className="header__navbar-product-item-link-content">Chăm sóc toàn diện</p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">HeiQ Viroblock</p>
                                                    <p className="header__navbar-product-item-link-content">Diệt 99,99 % virus</p>
                                                </a>
                                            </li>
                                            <li className="header__navbar-product-item">
                                                <a href="" className="header__navbar-product-item-link">
                                                    <p className="header__navbar-product-item-link-name">Exc<span className="hot-tag">HOT</span></p>
                                                    <p className="header__navbar-product-item-link-content">Nội soi</p>
                                                </a>
                                            </li>

                                        </ul>
                                    </div>
                                </div>

                            </div>

                        </li>

                        <li className="header__navbar-item navbar-item--about-coolmate">
                            <Link to="/about" className="header__navbar-link">Về Chúng Tôi</Link>
                            <div className="navbar-item--about-coolmate__menu-wrap">
                                <div className="about-coolmate__menu-inner">
                                    <a href="index.html">Đa khoa </a>
                                    <div className="row">
                                        <div className="col p-3">
                                            <a href="" className="about-coolmate__menu-inner-item">
                                                <img className="about-coolmate__menu-item-img" src="./Images/aboutdkpn.jpg" alt=""/>
                                                <p className="about-coolmate__menu-item-name">Phòng khám đa khoa </p>
                                                <p className="about-coolmate__menu-item-content">Ở đây chúng tôi quan tâm đến sức khỏe của bạn</p>
                                            </a>
                                            
                                        </div>
                                        <div className="col p-3">
                                            <a href="" className="about-coolmate__menu-inner-item">
                                                <img className="about-coolmate__menu-item-img" src="./Images/aboutdkpn1.jpg" alt=""/>
                                                <p className="about-coolmate__menu-item-name">Dịch vụ 100% hài lòng</p>
                                                <p className="about-coolmate__menu-item-content">Chúng tôi mang đến trải nhiệm khám bệnh đầy mong đợi</p>
                                            </a>
                                            
                                        </div>
                                        <div className="col p-3">
                                            <a href="" className="about-coolmate__menu-inner-item">
                                                <img className="about-coolmate__menu-item-img" src="./Images/aboutdkpn2.jpg" alt=""/>
                                                <p className="about-coolmate__menu-item-name">Khách hàng thân thiết</p>
                                                <p className="about-coolmate__menu-item-content">Những ưu đãi hấp dẫn dành cho khách hàng thân thiết</p>
                                            </a>
                                            
                                        </div>
                                        <div className="col p-3">
                                            <a href="" className="about-coolmate__menu-inner-item">
                                                <img className="about-coolmate__menu-item-img" src="./Images/story.png" alt=""/>
                                                <p className="about-coolmate__menu-item-name">Câu chuyện</p>
                                                <p className="about-coolmate__menu-item-content">Sứ mệnh của chúng tôi là mang đến sức khỏe </p>
                                            </a>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li className="header__navbar-item">
                            <Link to="chonsize" className="header__navbar-link">Tư vấn sức khỏe</Link>
                        </li>
                        <li className="header__navbar-item">
                            <Link to="/bacsi" className="header__navbar-link">Đội ngũ bác sĩ</Link>
                        </li>

                        <li className="header__navbar-item">
                            <Link to="dichvu" className="header__navbar-link">Gói khám bệnh</Link>
                        </li>

                        <li className="header__navbar-item">
                            <Link to="/datlich" className="header__navbar-link">Đặt lịch khám</Link>
                        </li>


                        <li className="header__navbar-item">
                            <a href="" className="header__navbar-link">Blog</a>
                        </li>

                    </ul>

                </div>

                <div className="header__actions">
                    <div className="header__actions-search">
                        <a className="header__actions-link">
                            <i className="fa-solid fa-magnifying-glass fa-xl"></i>
                        </a>
                    </div>
                    <div className="header__actions-account">
                    <Link to="/DangNhap" className="header__actions-link">
                        <i className="fa-solid fa-user fa-xl"></i>
                    </Link>
                    <div className="dropdown-menu">
                        {/* Hiển thị thông tin người dùng hoặc "Tên tài khoản" nếu không có người dùng */}
                        {user ? (
                            <>
                                <Link to="/capnhatthongtincanhan" className="dropdown-item">
                                    <i className="fas fa-user"></i> {' '}
                                    {user.name}
                                </Link>
                                <Link to="/donhang" className="dropdown-item">
                                    <i className="fas fa-shopping-bag"></i> Dịch vụ khám
                                </Link>
                                
                                <Link to="/hosokhambenh" className="dropdown-item">
                                    <i className="fas fa-file-medical"></i> Hồ sơ khám bệnh
                                </Link>

                                <Link to="/doithongtin" className="dropdown-item">
                                <i className="fas fa-user-edit"></i>Đổi thông tin
                                </Link>

                                <a href="" className="dropdown-item" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                </a>

                               
                            </>
                        ) : (
                            <>
                                <Link to="/DangNhap" className="dropdown-item">
                                    <i className="fas fa-sign-in-alt"></i> Đăng nhập
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                    <div className="header__actions-cart-icon">
                        <span className="header__actions-cart-notify">0</span>
                        <Link to="/cart" className="header__actions-link">
                            <i className="fa-solid fa-bag-shopping fa-xl"></i>
                        </Link>
                        <div className="mini-cart-wrap">
                            <div className="mini-cart">
                                <div className="mini-cart-head">
                                    <span><span className="added-product"></span>  Dịch Vụ</span>
                                    <a href="Cart-page.html">Xem tất cả</a>
                                </div>
                                <ul className="mini-cart__list">
                                    
                                </ul>
                            </div>
                        </div>
                        

                    </div>

                </div>
            </div>
            <div className="search" style= {{ display: 'none'}}>
                <div className="search__inner">
                    <input placeholder="Tìm kiếm sản phẩm..." className="search__input" type="text"/>
                    <img className="search__img" style= {{width: '20px'}}  src="/Images/icon-search.svg" alt=""/>
                </div>
            </div>
        </div>

    </header>
      </Fragment>
  )
}
