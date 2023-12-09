import StyleFooter from './footer.scss'
import logo from '../../../assest/images/logo.png'

function footer(){
    return(
        <footer className="footer" id="footer">
<div className="footer-main py-5">
    <div className="container">
      <div className="row gy-5 g-md-4 align-items-start lh-lg mb-5">
        <div className="col-md-3">
          <a className="footer-logo" href="">
            <img className="img-fluid" src={logo} alt=""/>
          </a>
          <div className="card-body p-4">
            <h6 className="card-title">TP. Hồ Chí Minh</h6>
            <ul className="list list-icons list-gap-2 mb-2 pb-1">
              <li className="list-item">
                Quận 1, TPHCM
              </li>
              <li className="list-item">
                <a href="tel:02462947586">02462947586</a>
              </li>
              <li className="list-item">
                <a href="tel:0867196779">ptithcm.edu.vn</a>
              </li>
            </ul>
          </div>
          <div className="social" >
            <a className="social-item" href="">
              <img className="img-fluid social-icon" src="https://dinotech.edu.vn/images/icons/facebook-circle.svg"
                alt="" />
            </a>
            <a className="social-item" href="">
              <img className="img-fluid social-icon" src="https://dinotech.edu.vn/images/icons/youtube-circle.svg" alt=""/>
            </a>
            <a className="social-item" href="">
              <img className="img-fluid social-icon" src="https://dinotech.edu.vn/images/icons/tiktok-circle.svg" alt=""/>
            </a>
          </div>
        </div>
        <div className="col-md-3 d-grid gap-5 gap-md-3">
          <div className="card-body p-4">
            <h6 className="card-title">VỀ PTIT HCM</h6>
            <ul className="list list-icons list-gap-2 mb-2 pb-1">
              <li className="mb-2">
                <a href="">Đội ngũ chuyên gia</a>
              </li>
              <li className="mb-2">
                <a href="">Mô hình đào tạo</a>
              </li>
              <li className="mb-2">
                <a href="">Triết lý đào tạo</a>
              </li>
              <li className="mb-2">
                <a href="">Phương pháp đào đạo</a>
              </li>
              <li className="mb-2">
                <a href="#">Báo chí</a>
              </li>
              <li className="mb-2">
                <a href="">Hệ thống cơ sở</a>
              </li>
              <li className="mb-2">
                <a href="#">Đối tác</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body p-4">
            <h6 className="card-title">CHƯƠNG TRÌNH HỌC</h6>
            <ul className="list list-icons list-gap-2 mb-2 pb-1">
              <li className="mb-2">
                <a href="">Đại học chính quy</a>
              </li>
              <li className="mb-2">
                <a href="">Cao đẳng</a>
              </li>
              <li className="mb-2">
                <a href="">Hệ học từ xa</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-3 d-grid gap-5 gap-md-3">
          <div className="card-body p-4">
            <h6 className="card-title">CHÍNH SÁCH, QUY ĐỊNH</h6>
            <ul className="list list-icons list-gap-2 mb-2 pb-1">
              <li className="mb-2">
                <a href="#">Chính sách, quy định chung</a>
              </li>
              <li className="mb-2">
                <a href="#">Quy trình cung ứng dịch vụ</a>
              </li>
              <li className="mb-2">
                <a href="#">Phương thức thanh toán</a>
              </li>
              <li className="mb-2">
                <a href="#">Chính sách bảo vệ thông tin</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  </footer>
    );
}

export default footer;