import { Fragment, useEffect, useState } from "react";
import Productt from "../../until/layoutauto";
import useProductFilter from "../../until/fillter";
import { Link, useSearchParams } from "react-router-dom";
import AddProduct from "../../until/cart";
import axios from 'axios';
import ReactPaginate from 'react-paginate';

export default function Product() {
    Productt();
    useProductFilter();
    AddProduct();
    
    const [data, setData] = useState([]);
    const [totalservice, setTotalProduct] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: Infinity });
    const [searchTerm, setSearchTerm] = useState({name:""}); // Thêm state cho nhóm sản phẩm

    // Di chuyển loadData ra ngoài useEffect
    const loadData = async () => {
        try {
            const page = searchParams.get('page') || 1;
            const response = await axios.get(`http://localhost:5000/api/getallgdv?page=${page}`);
            setTotalProduct(response.data[0].totalservice);
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu", error);
        }
    };

    const itemsPageSize = 10;

    const handlePageClick = (event) => {
        setSearchParams(params => {
            params.set('page', event.selected + 1);
            console.log(event.selected + 1);
            return params;
        });
    };

    const pageCount = Math.ceil(totalservice / itemsPageSize);

    useEffect(() => {
        if (searchParams.has('page')) {
            loadData(); // Tải dữ liệu khi component được mount
        } else {
            setSearchParams(params => {
                params.set('page', 1);
                return params;
            });
        }
    }, [searchParams, setSearchParams]);

    // Hàm tìm kiếm theo tên
    const handleSearchname = async (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm); // Cập nhật state khi tìm kiếm theo tên
        if (!searchTerm) {
            loadData();
        } else {
            try {
                const response = await axios.get(`http://localhost:5000/api/searchgdv/${searchTerm}`);
                setData(response.data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm dữ liệu", error);
            }
        }
    };

    // Hàm tìm kiếm theo nhóm sản phẩm
    const handleSearchtype = async (searchTerm) => {
        setSearchTerm(searchTerm); // Cập nhật state khi chọn nhóm sản phẩm
        handleSearchByPrice(priceRange.minPrice, priceRange.maxPrice, searchTerm);
    };

    const handlePriceFilterChange = (minPrice, maxPrice) => {
        setPriceRange({ minPrice, maxPrice });
        handleSearchByPrice(minPrice, maxPrice);
    };

    // Hàm tìm kiếm theo giá và nhóm sản phẩm
    const handleSearchByPrice = async (minPrice, maxPrice, name) => {
        const Name = name !== undefined ? name : searchTerm; 

        try {
            const params = {};

            if (!isNaN(minPrice) && minPrice !== "" && minPrice !== null) {
                params.minPrice = Number(minPrice);
            }

            if (!isNaN(maxPrice) && maxPrice !== "" && maxPrice !== null) {
                params.maxPrice = Number(maxPrice);
            }

            if (Name && Name.trim() !== "") {
                params.name = Name.trim();
            }

            // Nếu không có điều kiện nào, load tất cả
            if (Object.keys(params).length === 0) {
                loadData();
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/searchgdvprice`, { params });
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm theo giá/nhóm sản phẩm", error);
        }
    };

    useEffect(() => {
        handleSearchByPrice(priceRange.minPrice, priceRange.maxPrice);
    }, [priceRange]);

    useEffect(() => {
        handleSearchByPrice(searchTerm.name);
    }, [searchTerm]);


    const formatCurrency = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };
    return (
        <Fragment>
            <div className="all-product-container" style={{ paddingBottom: '30px' }}>
                <div className="filter">
                    <h2>Dịch vụ khám</h2>
                    <div className="filter-search">
                        <input  onChange={handleSearchname} placeholder="Tìm kiếm dịch vụ..." type="text" />
                        {/* <button
                        >
                            <img src="../Images/icon-search.svg" alt="" />
                        </button> */}
                    </div>
                    <div className="filter-size filter-item">
                        <div className="filter-item__inner">
                            <span>Mức giá</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li>abc</li>
                            <li onClick={() => handlePriceFilterChange(0,99999999999)}>Hiển thị tất cả</li>
                            <li onClick={() => handlePriceFilterChange(100000, 200000)}>100.000đ - 200.000đ</li>
                            <li onClick={() => handlePriceFilterChange(200000, 500000)}>200.000đ - 500.000đ</li>
                            <li onClick={() => handlePriceFilterChange(500000, 1000000)}>500.000đ - 1.000.000đ</li>
                            <li onClick={() => handlePriceFilterChange(1000000,99999999999 )}>Trên 1.000.000đ</li>
                        </ul>
                    </div>

                    <div className="filter-type filter-item">
                        <div className="filter-item__inner">
                            <span>Nhóm sản phẩm</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            {[
                                { value: "", label: "Tất cả dịch vụ" },
                                { value: "", label: "Tất cả dịch vụ" },
                                { value: "nam", label: "Gói dịch vụ cho nam" },
                                { value: "nữ", label: "Gói dịch vụ cho nữ" },
                                { value: "dinh dưỡng", label: "Gói tư vấn dinh dưỡng" },
                                { value: "trẻ em", label: "Gói khám cho trẻ em" },
                                { value: "cao tuổi", label: "Gói khám cho người cao tuổi" },
                                { value: "tim", label: "Gói khám tim mạch" },
                                { value: "xét nhiệm", label: "Gói khám xét nhiệm" },
                            ].map((item) => (
                                <li key={item.value} onClick={() => handleSearchtype(item.value)}>
                                    {item.label}
                                </li>
                            ))}
                        </ul>

                   
                    </div>
                    <div className="filter-sort filter-item">
                        <div className="filter-item__inner">
                            <span>Sắp xếp</span>
                            <i className="fa-solid fa-angle-down"></i>
                        </div>
                        <ul className="filter-item__option">
                            <li>Mới nhất</li>
                            <li>Bán chạy</li>
                            <li>Giá thấp đến cao</li>
                            <li>Giá cao đến thấp</li>
                            <li>% Giảm nhiều nhất</li>
                        </ul>
                    </div>
                </div>
                <div className="container1">
                    <div className="product-type">
                        <div className="row">
                            {/* Sản phẩm mẫu */}
                            

                            {/* Render sản phẩm từ dữ liệu */}
                            {data.map((item) => (
                                <div key={item.id_dich_vu} className="col p-2-4">
                                    <div id={`${item.id_dich_vu}`} className="product">
                                        <div className="product-img-wrap" style={{ marginBottom: '8px' }}>
                                            <Link to={`/detail/${item.id_dich_vu}`} className="product-img product-img--small">
                                                <img className="product-img-1" src={item.hinh_anh_dv} alt="" />
                                                <img className="product-img-2" src={item.anh_hover} alt="" />
                                            </Link>
                                            <div className="product-size">
                                                <p>Thêm nhanh vào giỏ hàng +</p>
                                                <div className="btn btn--size">Thêm dịch vụ khám</div>
                                            </div>
                                        </div>
                                        <div className="product-content">
                                            <div style={{ display: 'none' }} className="product-content__option">
                                                <div className="product-content__option-item-wrap active">
                                                    <span className="product-id-khoa" data-id-khoa={item.id_khoa}></span>
                                                </div>
                                            </div>
                                            <a className="product-name">{item.ten_dich_vu}</a>
                                            <div className="product-price-wrap">
                                                <div className="product-price">{formatCurrency(item.gia)}</div>
                                            </div>
                                            <div className="product-discount">
                                                {item.thong_bao}
                                            </div>
                                            <div className="sale-tag product-tag">{item.uu_dai}</div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
                <ReactPaginate
                breakLabel="..."
                nextLabel="Trang tiếp >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< Trước"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="active"
            />
                
            </div>

           
        </Fragment>
    );
}
