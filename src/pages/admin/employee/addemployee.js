import {toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import 'react-toastify/dist/ReactToastify.css';
var token = localStorage.getItem('token');


var uls = new URL(document.URL)
var idemp = uls.searchParams.get("id");

async function saveEmployee(event){
    event.preventDefault();
    const payload = {
        fullname: event.target.elements.fullname.value,
        DOB: event.target.elements.dob.value,
        gender: event.target.elements.gender.value,
        email: event.target.elements.email.value,
        phone: event.target.elements.phone.value,
        address: event.target.elements.address.value,
        qualification: event.target.elements.qualification.value,
        username: event.target.elements.username.value,
        changePass: idemp==null?false:event.target.elements.changePass.checked
    };
    var url = 'http://localhost:8080/api/employee/admin/create'
    if(idemp != null){
        url = 'http://localhost:8080/api/employee/admin/update/'+idemp;
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if (response.status < 300) {
        toast.success("Thành công");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.href = 'employee';
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.errorMessage);
    }
}

async function loadEmployee(){
    if(idemp != null){
        var url = 'http://localhost:8080/api/employee/admin/find-by-id?id='+idemp
        const response = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        return response;
    }
    return null;
}


const AdminAddEmployee = ()=>{
    const [emp, setEmp] = useState(null);
    useEffect(()=>{
        const getEmployee = async() =>{
            const response = await loadEmployee();
            if(response == null){
                setEmp(null);
            }
            else{
                var result = await response.json();
                setEmp(result)
            }
        };
        getEmployee();
    },[]);

    if(emp != null){
        console.log(emp.profile.dob);
    }

    return(
        <form onSubmit={saveEmployee} className='row' method='post'>
            <h4>Thêm/ cập nhật nhân viên</h4>
            <div className="col-sm-5">
                <label className="lb-form">Họ tên</label>
                <input defaultValue={emp!=null?emp.profile.fullname:""} name="fullname" className="form-control" />
                <label className="lb-form">Tên đăng nhập</label>
                <input defaultValue={emp!=null?emp.user.username:""} name="username" className="form-control" />
                <label className="lb-form">Ngày sinh</label>
                <input defaultValue={emp==null?"":emp.profile.dob?.split("T")[0]} name="dob" type="date" className="form-control" />
                <label className="lb-form">Số điện thoại</label>
                <input defaultValue={emp!=null?emp.profile.phone:""} name="phone" className="form-control" />
                <label className="lb-form">giới tính</label>
                <select defaultValue={emp!=null?emp.profile.gender:""} name='gender' className="form-control">
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                </select>
            </div>
            <div className="col-sm-5">
                <label className="lb-form">Email</label>
                <input defaultValue={emp!=null?emp.profile.email:""} name="email" type='email' className="form-control" />
                <label className="lb-form">Địa chỉ</label>
                <input defaultValue={emp!=null?emp.profile.address:""} name="address" className="form-control" />
                <label className="lb-form">Chuyên môn</label>
                <textarea defaultValue={emp!=null?emp.profile.qualification:""} name='qualification' className="form-control"></textarea>
                {idemp == null?"":<label className="checkbox-custom">Đặt lại mật khẩu theo ngày sinh
                    <input name="changePass" type="checkbox"/>
                    <span className="checkmark-checkbox"></span>
                </label>}<br/>
                <button className='btn btn-primary form-control'>Thêm/ cập nhật nhân viên</button>
            </div>
        </form>
    );
}

export default AdminAddEmployee;