import React, { Fragment, useEffect, useState } from 'react'
import Payment from '../../until/detailservices';
import AddProduct from '../../until/cart';
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function Details() {
    Payment();
    AddProduct();

    const [sanpham ,setData] = useState({});

    const{id_dich_vu} = useParams();

    useEffect(()=>{
        axios.get(`http://localhost:5000/api/getgdvid/${id_dich_vu}`)
        .then((resp) => setData({...resp.data[0]}));
    },[id_dich_vu]);

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };  

  return (
    <Fragment>
        <main>
            <div class="container1">
            <div class="container-product-single">
                    <div class="imgs">
                        <div class="link-page">
                            <a href="./index.html" class="link-page__homepage">Trang chủ</a>
                            <span>/</span>
                            <a href="./product-detail.html" class="link-page__currentPage">Dịch vụ khám</a>
                        </div>
                        <div class="index-img">
                            <div class="index-img__item active"></div>
                            {/* <div class="index-img__item"></div>
                            <div class="index-img__item"></div> */}
                        </div>
                        <div class="product-single-img">
                            <img class="product-img__main" src={sanpham.hinh_anh_dv} alt=""/>
                            <div class="product-img__option">
                                {/* <div  class="product-img__option-item active">
                                    <img src={sanpham.hinh_anh_dv} alt=""/>
                                </div>
                                <div  class="product-img__option-item active">
                                    <img src={sanpham.hinh_anh_dv} alt=""/>
                                </div>
                                <div class="product-img__option-item">
                                    <img src={sanpham.hinh_anh_dv} alt=""/>
    
                                </div>                                                    */}
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <h1 class="content__heading">{sanpham.ten_dich_vu}</h1>
                        <div class="review-rating">
                            <p class="review-label">
                                Số khách hàng đã sử dụng(web): 15
                            </p>  
                                              
                        </div>

                        <p class="content__price">{formatCurrency(sanpham.gia)}</p>
                        <div class="content__discount">{sanpham.thong_bao}</div>
                        <div style={{ display: 'none' }} className="product-content__option">
                                                <div className="product-content__option-item-wrap active">
                                                    <span className="product-id-khoa" data-id-khoa={sanpham.id_khoa}></span>
                                                </div>
                        </div>

                        <div class="content__size">
                            <div class="product-single__actions">
                                <div class="quantity">
                                    
                                    <button class="btn-decrease">-</button>
                                    <span>1</span>
                                    <button class="btn-increase">+</button>
                                </div>
                                <div class="btn btn-addCart">
                                    Thêm dịch vụ
                                </div>
                            </div>
                        </div>
                        <div class="product-single__policy">
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon3.svg" alt=""/>
                            </div>
                            <p>Đặt lịch hẹn khám dễ dàng qua số điện thoại hoặc website</p>
                        </div>
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon4.svg" alt=""/>
                            </div>
                            <p>Miễn phí khám lần đầu cho bệnh nhân mới</p>
                        </div>
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon5.svg" alt=""/>
                            </div>
                            <p>Đổi bác sĩ trong vòng 60 ngày nếu không hài lòng với dịch vụ</p>
                        </div>
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon2.svg" alt=""/>
                            </div>
                            <p>Hotline 1900.27.27.37 hỗ trợ từ 8h30 - 22h mỗi ngày cho mọi thắc mắc</p>
                        </div>
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon1.svg" alt=""/>
                            </div>
                            <p>Chuyên gia y tế có thể đến tận nơi khám bệnh cho bệnh nhân không di chuyển được</p>
                        </div>
                        <div class="product-policy__item">
                            <div class="product-policy__icon">
                                <img src="https://www.coolmate.me/images/icons/icon6.svg" alt=""/>
                            </div>
                            <p>Thời gian hẹn khám: từ 1-3 ngày (tùy thuộc vào tình trạng bệnh nhân và lịch hẹn)</p>
                        </div>
                    </div>
                    <div class="salient-features">
                        <div class="salient-features__header">
                            <span>Đặc điểm nổi bật của dịch vụ y tế</span>
                        </div>
                        <ul>
                            <li class="salient-features__item">- Đội ngũ bác sĩ chuyên khoa, có kinh nghiệm từ 5 năm trở lên</li>
                            <li class="salient-features__item">- Cơ sở vật chất hiện đại, đảm bảo tiêu chuẩn y tế quốc tế</li>
                            <li class="salient-features__item">- Dịch vụ khám bệnh nhanh chóng, tiện lợi và linh hoạt theo yêu cầu của bệnh nhân</li>
                            <li class="salient-features__item">- Chăm sóc tận tình, luôn lắng nghe và đáp ứng nhu cầu của bệnh nhân</li>
                            <li class="salient-features__item">- Địa chỉ khám chữa bệnh uy tín với nhiều phản hồi tích cực từ bệnh nhân</li>
                            <li class="salient-features__item">- Hỗ trợ tư vấn miễn phí 24/7 về sức khỏe và dịch vụ y tế</li>
                            <li class="salient-features__item">- Có nhiều gói khám sức khỏe đa dạng, phù hợp với nhu cầu của từng bệnh nhân</li>
                        </ul>
                    </div>

                    </div>                    
                </div>
                <div class="detail-wrap">
                <div class="detail">
    <h2 class="detail__heading">Chi tiết dịch vụ</h2>
    
    <h4>Lợi ích gói khám mang lại:</h4>
    <ul>
        <li>{sanpham.mo_ta}</li>
    </ul>

    <h4>Xét nhiệm sàng lọc bệnh lý:</h4>
    <ul>
        <li>{sanpham.loi_ich_kham}</li>
    </ul>

    <h4>Thời gian thăm khám:</h4>
    <ul>
        <li>{sanpham.huong_dan_kham}</li>
    </ul>

    <img src="/images/chitietdichvukham.jpg" alt="Chi tiết dịch vụ"/>
</div>

    </div>
    <div class="feedback">
    <div class="review-title">
        <p class="quantity-review">966 Đánh giá</p>
        <div class="quantity-star">
            <span>4.8 / 5</span>
            <i class="fa-solid fa-star"></i>
        </div>
    </div>
    <div class="review-fillter">
        <div class="review-fillter__rating">
            <select name="" id="">
                <option value="">Đánh giá</option>
                <option value="1">1 sao</option>
                <option value="2">2 sao</option>
                <option value="3">3 sao</option>
                <option value="4">4 sao</option>
                <option value="5">5 sao</option>
            </select>
        </div>
        <div class="review-filter__image">
            <select name="" id="">
                <option value="">Ảnh</option>
                <option value="true">Có ảnh</option>
                <option value="false">Không ảnh</option>
            </select>
        </div>
        <div class="review-filter__replied">
            <select name="" id="">
                <option value="">Phản hồi</option>
                <option value="true">Đã phản hồi</option>
                <option value="false">Chưa phản hồi</option>
            </select>
        </div>
    </div>
    <div class="feedback-content">
        <div class="row no-gutters">
            <div class="col p-6">
                <div class="feedback-item">
                    <div class="feedback-item__rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star disabled"></i>
                    </div>
                    <div class="feedback-item__body">
                        <b class="feedback-userName">NguyenHai</b>
                        <i class="feedback-product-type">Gói Khám Tổng Quát</i>
                        <p class="feedback-of-custom">Dịch vụ chuyên nghiệp, bác sĩ tận tâm, tư vấn chi tiết.</p>
                        <p class="feedback-time">08.05.2023</p>
                    </div>
                </div>
            </div>
            <div class="col p-6">
                <div class="feedback-item">
                    <div class="feedback-item__rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="feedback-item__body">
                        <b class="feedback-userName">Nguyễn Huy Sơn</b>
                        <i class="feedback-product-type">Gói Khám Nha Khoa</i>
                        <p class="feedback-of-custom">Bác sĩ nhiệt tình, khám kỹ càng, dịch vụ rất tốt.</p>
                        <p class="feedback-time">08.05.2023</p>
                    </div>
                </div>
            </div>
            <div class="col p-6">
                <div class="feedback-item">
                    <div class="feedback-item__rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star disabled"></i>
                    </div>
                    <div class="feedback-item__body">
                        <b class="feedback-userName">Mai Đức Hân</b>
                        <i class="feedback-product-type">Gói Khám Tim Mạch</i>
                        <p class="feedback-of-custom">Khám kỹ, nhân viên nhiệt tình. Góp ý: nâng cấp trang thiết bị.</p>
                        <p class="feedback-time">08.05.2023</p>
                    </div>
                </div>
            </div>
            <div class="col p-6">
                <div class="feedback-item">
                    <div class="feedback-item__rating">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div class="feedback-item__body">
                        <b class="feedback-userName">Đặng Duy Hải</b>
                        <i class="feedback-product-type">Gói Khám Sức Khỏe Sinh Sản</i>
                        <p class="feedback-of-custom">Quy trình nhanh, bác sĩ tận tâm, cảm thấy yên tâm.</p>
                        <p class="feedback-time">08.05.2023</p>
                    </div>
                </div>
            </div>
            <div class="row no-gutters">
    <div class="col p-6">
        <div class="feedback-item">
            <div class="feedback-item__rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star disabled"></i>
            </div>
            <div class="feedback-item__body">
                <b class="feedback-userName">Nguyễn Hoàng Phúc</b>
                <i class="feedback-product-type">Gói Khám Nội Soi Dạ Dày</i>
                <p class="feedback-of-custom">Dịch vụ nhanh chóng, bác sĩ tư vấn kỹ, rất hài lòng.</p>
                <p class="feedback-time">08.05.2023</p>
            </div>
        </div>
    </div>
    <div class="col p-6">
        <div class="feedback-item">
            <div class="feedback-item__rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star disabled"></i>
            </div>
            <div class="feedback-item__body">
                <b class="feedback-userName">Đỗ Quang Huynh</b>
                <i class="feedback-product-type">Gói Khám Phụ Khoa</i>
                <p class="feedback-of-custom">Bác sĩ nữ rất thân thiện và chuyên nghiệp, quy trình nhanh gọn.</p>
                <p class="feedback-time">09.04.2022</p>
            </div>
        </div>
    </div>
    <div class="col p-6">
        <div class="feedback-item">
            <div class="feedback-item__rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
            </div>
            <div class="feedback-item__body">
                <b class="feedback-userName">Lê Cường</b>
                <i class="feedback-product-type">Gói Khám Mắt</i>
                <p class="feedback-of-custom">Khám nhanh, bác sĩ rất chu đáo, trang thiết bị hiện đại.</p>
                <p class="feedback-time">05.10.2022</p>
            </div>
        </div>
    </div>
    <div class="col p-6">
        <div class="feedback-item">
            <div class="feedback-item__rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star disabled"></i>
            </div>
            <div class="feedback-item__body">
                <b class="feedback-userName">Nguyễn Khang</b>
                <i class="feedback-product-type">Gói Khám Tai - Mũi - Họng</i>
                <p class="feedback-of-custom">Dịch vụ ổn định, không phải chờ đợi lâu, bác sĩ tận tâm.</p>
                <p class="feedback-time">08.05.2023</p>
            </div>
        </div>
    </div>
    <div class="col p-6">
        <div class="feedback-item">
            <div class="feedback-item__rating">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
            </div>
            <div class="feedback-item__body">
                <b class="feedback-userName">Khoa</b>
                <i class="feedback-product-type">Gói Khám Da Liễu</i>
                <p class="feedback-of-custom">Dịch vụ tốt, bác sĩ giải đáp tận tình, thoải mái và yên tâm.</p>
                <p class="feedback-time">08.05.2023</p>
            </div>
        </div>
    </div>
</div>

        </div>
    </div>
    <div class="feedback-page">
        <i class="fa-solid fa-angle-left btn-page-left"></i>
        <span>1/19</span>
        <i class="fa-solid fa-angle-right btn-page-right"></i>
    </div>
</div>

            </div>
        </main>
    </Fragment>
  );
}
