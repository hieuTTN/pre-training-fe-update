import styles from './header.scss';
import logo from '../../../assest/images/logo.png';
import {handleChangePass} from '../../../services/auth'

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('/login')
}

function header (){
    var token = localStorage.getItem('token');
    var authen = <li className="nav-item"><a className="nav-link" href="/login">Đăng nhập</a></li>
    if(token != null){
        var userloggin = localStorage.getItem("user")
        if(userloggin != null){
            userloggin = JSON.parse(userloggin)
        }
        if(userloggin == null){
            localStorage.removeItem("token");
            window.location.href = 'login'
        }
        var acc = ''
        var ctdt = ''
        if(userloggin.authorities.name == 'ROLE_STUDENT'){
            acc = <li><a className="dropdown-item" href="/account-student">Tài khoản</a></li>
            ctdt = <li className="nav-item"><a className="nav-link" href="/dao-tao/student">Xem chương trình đào tạo</a></li>
        }
        if(userloggin.authorities.name == 'ROLE_TEACHER'){
            acc = <li><a className="dropdown-item" href="/account-teacher">Tài khoản</a></li>
            ctdt = <li className="nav-item"><a className="nav-link" href="/dao-tao/teacher">Xem chương trình đào tạo</a></li>
        }
        authen = <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Tài khoản
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {acc}
                    <li><a data-bs-toggle="modal" data-bs-target="#changepassword" className="dropdown-item logoutitem">Đổi mật khẩu</a></li>
                    <li><a className="dropdown-item logoutitem" onClick={logout}>Đăng xuất</a></li>
                    </ul>
                </li>
    }
    return(
        <div>
            <div className="menutop">
            <div className="container listmenutop">
            <img src={logo} className="imglogo" />
            <div className="searchheader">
                <form className="input-group">
                <input className="inputsearchheader" placeholder="Tìm kiếm" name="title" />
                <button className="btnsearchheader">
                    <i className="fa fa-search iconsearchheader"></i>
                </button>
                </form>
            </div>
            <div className="d-lg-flex ms-auto">
                <a className="hotline-item itemphone" href="tel:02462947586">
                <i className="fa fa-phone"></i>
                <span className="d-none d-xl-inline ms-2">02462947586</span>
                </a>
                <a className="hotline-item" href="mailto:ptithcm.edu.vn">
                <i className="fa fa-envelope"></i>
                <span className="d-none d-xl-inline ms-2">ptithcm.edu.vn</span>
                </a>
            </div>
            </div>
            </div>


        <div id="navigation">
            <div className="container menubottom">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav navbar-nav-hover navbar-nav-effect">
                    <li className="nav-item"><a className="nav-link" aria-current="page" href="/">Trang chủ</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Xem thời khóa biểu</a></li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Tin tức
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" href="#">Tin tức chung</a></li>
                        <li><a className="dropdown-item" href="#">Tin khác</a></li>
                        </ul>
                    </li>
                    <li className="nav-item"><a className="nav-link" href="/intro">Xem lịch thi</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Xem học phí</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Xem điểm</a></li>
                    {ctdt}
                    {authen}
                    </ul>
                </div>
                </div>
            </nav>
            </div>
        </div>
        <div class="modal fade" id="changepassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Đổi mật khẩu</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form method='post' onSubmit={handleChangePass}>
                                <label class="lbacc">Mật khẩu hiện tại *</label>
                                <input required name='currentpass' type="password" class="form-control" />
                                <label class="lbacc">Mật khẩu mới *</label>
                                <input required name='newpass' type="password" class="form-control"/>
                                <label class="lbacc">Xác nhận mật khẩu mới *</label>
                                <input required name='renewpass' type="password" class="form-control"/>
                                <button type="submit" class="btntt">LƯU</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    
}

export default header;