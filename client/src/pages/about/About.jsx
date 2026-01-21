import React from 'react';

export default function About() {
  return (
    <div id="polyclinic-story">
      <section className="cs-banner">
        <div className="cs-banner__image">
          <img src="../Images/aboutdkpnbanner_upscayl_2x_ultrasharp.png" alt="" />
        </div>
        <div className="cs-banner__content">
        </div>
      </section>
      <section className="cs-about">
        <div className="container-medium">
          <div className="grid">
            <div className="grid__column four-twelfths">
              <div className="cs-about__content">
                <h2 className="cs-about__heading">
                  Phòng khám sinh ra <br /> để làm gì?
                </h2>
              </div>
              <div className="cs-about__image">
                <img src="../Images/anhposter4.jpg" alt="" />
              </div>
            </div>
            <div className="grid__column eight-twelfths">
              <div className="cs-about__description">
                <p>
                  Phòng khám của chúng tôi được thành lập với mong muốn cung cấp dịch vụ y tế chất lượng cao và chăm sóc sức khỏe tốt nhất cho bệnh nhân.
                </p>
                <p>
                  “Chúng tôi sinh ra với mục tiêu trở thành biểu tượng cho mô hình CƠ SỞ Y TẾ TRÁCH NHIỆM, cung cấp dịch vụ y tế chuyên nghiệp và đáng tin cậy cho mọi người.”
                </p>
                <p>
                  Phòng khám được thành lập vào tháng 1/2020, với một đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại. Chúng tôi cung cấp nhiều loại dịch vụ chăm sóc sức khỏe, bao gồm khám bệnh, xét nghiệm, và điều trị chuyên khoa.
                </p>
                <p>
                  Chúng tôi không ngừng mở rộng các dịch vụ và cải tiến quy trình làm việc để đáp ứng nhu cầu của bệnh nhân. Chúng tôi cam kết sẽ luôn đồng hành cùng bạn trên hành trình chăm sóc sức khỏe.
                </p>
                <p>
                  Đến nay, phòng khám đã phục vụ hàng ngàn bệnh nhân và nhận được sự tin tưởng từ cộng đồng. Chúng tôi luôn đặt sức khỏe của bạn lên hàng đầu.
                </p>
                <p>
                  Để biết thêm thông tin chi tiết, vui lòng <a href="#" style={{ textDecoration: 'underline' }}>tham khảo thêm</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cs-caption">
        <div className="container-medium">
          <h2 className="cs-caption__heading">
            <span>“</span>
            Chúng tôi cam kết cung cấp dịch vụ y tế chất lượng và tận tâm nhất cho bệnh nhân.
            <span>“</span>
          </h2>
          <span className="cs-caption__author">Bác sĩ Nguyễn Văn Ánh, Giám đốc Phòng khám</span>
        </div>
      </section>
      <section className="cs-story">
        <div className="container-medium">
          <div className="grid grid--mobile-rev">
            <div className="grid__column five-twelfths">
              <div className="cs-story__image">
                <img src="../Images/anhposter1.jpg" alt="#" />
                <span className="cs-services__alt">Đội ngũ y bác sĩ tại Phòng khám</span>
              </div>
            </div>
            <div className="grid__column seven-twelfths">
              <div className="cs-story__content">
                <div className="cs-story__heading">
                  Câu chuyện dịch vụ chăm sóc sức khỏe của phòng khám
                  <br className="mobile--hidden" />
                </div>
                <div className="ca-story__description">
                  <p>
                    Theo khảo sát gần đây, 90% bệnh nhân cảm thấy hài lòng với dịch vụ chăm sóc của chúng tôi. Chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho bệnh nhân.
                  </p>
                  <p>
                    Đội ngũ y bác sĩ của chúng tôi không chỉ có kiến thức chuyên môn cao mà còn luôn lắng nghe và hiểu rõ nhu cầu của bệnh nhân.
                  </p>
                  <p>
                    Chúng tôi tin rằng chăm sóc sức khỏe không chỉ là chữa trị bệnh mà còn là tạo dựng niềm tin và sự an tâm cho bệnh nhân.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cs-services">
        <div className="container-medium">
          <h2 className="cs-services__heading">
            Câu chuyện về mô hình dịch vụ y tế TRÁCH NHIỆM <br />
            phòng khám đang hướng tới
          </h2>
          <div id="services1" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#1. Với bệnh nhân</h3>
              <div className="cs-services__description">
                <p>
                  Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất với mức giá hợp lý. Phòng khám sử dụng công nghệ tiên tiến để đảm bảo chẩn đoán và điều trị chính xác.
                </p>
                <p>
                  Chúng tôi tin tưởng rằng mỗi bệnh nhân đều xứng đáng nhận được sự quan tâm và chăm sóc tận tình nhất.
                </p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/anhposter2.jpg" alt="" />
                <span className="cs-services__alt">Ảnh tại Phòng khám</span>
              </div>
            </div>
          </div>
          <div id="services2" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#2. Với nhân viên</h3>
              <div className="cs-services__description">
                <p>
                  Chúng tôi tạo ra một môi trường làm việc thân thiện và chuyên nghiệp, nơi mà mỗi nhân viên đều có thể phát triển bản thân và đóng góp vào sự phát triển của phòng khám.
                </p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/phong-kham.jpg" alt="" />
                <span className="cs-services__alt">Ảnh các nhân viên tại Phòng khám</span>
              </div>
            </div>
          </div>
          <div id="services3" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#3. Đối với cộng đồng</h3>
              <div className="cs-services__description">
                <p>
                  Chúng tôi luôn cố gắng góp phần vào sự phát triển của cộng đồng thông qua các chương trình y tế cộng đồng và các hoạt động từ thiện.
                </p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/aboutdkpn.jpg" alt="" />
                <span className="cs-services__alt">Ảnh các hoạt động cộng đồng</span>
              </div>
            </div>
          </div>
          <div id="services4" className="grid grid--aligned-center">
            <div className="grid__column">
              <h3 className="cs-services__title">#4. Với môi trường</h3>
              <div className="cs-services__description">
                <p>
                  Phòng khám chúng tôi cam kết bảo vệ môi trường bằng cách áp dụng các quy trình thân thiện với môi trường trong hoạt động hàng ngày.
                </p>
              </div>
            </div>
            <div className="grid__column">
              <div className="cs-services__image">
                <img src="../Images/services4.png" alt="" />
                <span className="cs-services__alt">Ảnh tại Phòng khám</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cs-thanks">
        <div className="container-medium">
          <h2 className="cs-thanks__heading">
            Trong cuộc sống có quá nhiều sự lựa chọn,
            <br />
            Cảm ơn bạn đã chọn chúng tôi!
          </h2>
          <span>“</span>
        </div>
      </section>
      <section className="cs-more">
        <div className="container-medium">
          <h2 className="cs-more__heading">
            <span>“</span>
            Chúng tôi cam kết cung cấp dịch vụ y tế chất lượng và tận tâm nhất cho bệnh nhân.
            <span>“</span>
          </h2>
        </div>
      </section>
    </div>
  );
}
