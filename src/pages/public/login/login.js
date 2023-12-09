import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './login.scss'
import logologin from '../../../assest/images/logo.png'
import {handleLogin} from '../../../services/auth';


function login(){
    return(
        <div className="login-form">
            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <img src={logologin} className="img-login" />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 col-12 content-login">
                <form onSubmit={handleLogin} method='post'>
                    <h4 className='center-text'>Đăng Nhập</h4>
                    <label>Tên đăng nhập</label>
                    <input required name='username' id="username" type="text" placeholder="Tên đăng nhập" className="form-control"/>
                    <label>Mật khẩu</label>
                    <input required name='password' id="password" type="password" placeholder="******" className="form-control"/>
                    <button type='submit' className="btn-login">Đăng nhập</button>
                    <a className="forgot-password" data-bs-toggle="modal" data-bs-target="#exampleModalhocvien">Quên mật khẩu</a>
                </form>
                </div>
            </div>
        </div>
        
    );
}
export default login;