import {toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import {requestGet} from '../../../services/request'

var token = localStorage.getItem('token');
var uls = new URL(document.URL)
var id = uls.searchParams.get("id");

async function loadAllFaculty(){
    const response = await fetch('http://localhost:8080/api/faculty/all/find-all', {
        headers: new Headers({ 'Authorization': 'Bearer ' + token })
    });
    return response;
}

async function loadTeacher(){
    if(id != null){
        var url = 'http://localhost:8080/api/lecture/employee/find-by-id?id='+id
        const response = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        return response;
    }
    return null;
}

async function saveTeacher(event){
    event.preventDefault();
    const payload = { 
        facultyId:Number(event.target.elements.faculty.value),
        degreeId:Number(event.target.elements.degree.value),
        fullname:event.target.elements.fullname.value,
        DOB:event.target.elements.dOB.value,
        gender:event.target.elements.gender.value,
        email:event.target.elements.email.value,
        phone:event.target.elements.phone.value,
        address:event.target.elements.address.value,
        qualification:event.target.elements.qualification.value,
        username:event.target.elements.username.value,
        changePass: id==null?false:event.target.elements.changePass.checked
    }
    console.log(payload)
    // return;
    var url = 'http://localhost:8080/api/lecture/employee/create'
    if(id != null){
        url = 'http://localhost:8080/api/lecture/employee/update/'+id;
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
        window.location.href = 'teacher';
    }
    if (response.status == 417) {
        var result = await response.json()
        console.log(result)
        toast.warning(result.errorMessage);
    }
}

const EmployeeAddTeacher = ()=>{
    const [itemFaculty, setFaculty] = useState([]);
    const [itemDegree, setItemDegree] = useState([]);
    const [initFaculty, setInitFaculty] = useState(null);
    const [initDegree, setInitDegree] = useState(null);
    const [teacher, setTeacher] = useState(null);
    useEffect(()=>{
        const getTeacher = async() =>{
            const response = await loadTeacher();
            if(response == null){
                setTeacher(null);
            }
            else{
                var result = await response.json();
                setTeacher(result)
                setInitFaculty(result.faculty)
                setInitDegree(result.degree)
            }
        };
        getTeacher();
        const getFaculty = async() =>{
            const response = await loadAllFaculty();
            var result = await response.json();
            setFaculty(result)
        };
        getFaculty();
        const getDegree = async() =>{
            const response = await requestGet('http://localhost:8080/api/degree/employee/find-all');
            var list = await response.json();
            setItemDegree(list);
        };
        getDegree();
    },[]);

    return(
        <form onSubmit={saveTeacher} className='row' method='post'>
            <h4>Thêm/ cập nhật giảng viên</h4>
            <div className="col-sm-5">
                <label className="lb-form">Mã giảng viên</label>
                <input name='username' defaultValue={teacher==null?"":teacher.user.username} className="form-control" />
                <label className="lb-form">Tên giảng viên</label>
                <input name='fullname' defaultValue={teacher==null?"":teacher.profile.fullname} className="form-control" />
                <label className="lb-form">Ngày sinh</label>
                <input name='dOB' type='date' defaultValue={teacher==null?"":teacher.profile.dob?.split("T")[0]} className="form-control" />
                <label className="lb-form">Giới tính</label>
                <select name='gender' className='form-control'>
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                </select>
                <label className="lb-form">Học hàm/ học vị</label>
                <Select name='degree'
                    value={initDegree}
                    onChange={(item) => {
                        setInitDegree(item);
                    }}
                    options={itemDegree} 
                    getOptionLabel={(itemDegree)=>itemDegree.name} 
                    getOptionValue={(itemDegree)=>itemDegree.id}  
                    placeholder="Chọn học vị"/>
                <label className="lb-form">Số điện thoại</label>
                <input name='phone' defaultValue={teacher==null?"":teacher.profile.phone} className="form-control" />
            </div>
            <div className="col-sm-7">
                <label className="lb-form">Chọn khoa</label>
                <Select name='faculty'
                    value={initFaculty}
                    onChange={(item) => {
                        setInitFaculty(item);
                    }}
                    options={itemFaculty} 
                    getOptionLabel={(itemFaculty)=>itemFaculty.name} 
                    getOptionValue={(itemFaculty)=>itemFaculty.facultyId}  
                    placeholder="Lọc theo khoa"/>
                <label className="lb-form">Email</label>
                <input name='email' defaultValue={teacher==null?"":teacher.profile.email} className="form-control" />
                <label className="lb-form">Địa chỉ</label>
                <input name='address' defaultValue={teacher==null?"":teacher.profile.address} className="form-control" />
                <label className="lb-form">Chuyên môn</label>
                <textarea name='qualification' defaultValue={teacher==null?"":teacher.profile.address} className="form-control" />
                {id == null?"":<label className="checkbox-custom">Đặt lại mật khẩu theo ngày sinh
                    <input name="changePass" type="checkbox"/>
                    <span className="checkmark-checkbox"></span>
                </label>}
                <br/>
                <button className='btn btn-primary form-control'>Thêm/ cập nhật giảng viên</button>
            </div>
        </form>
    );
}

export default EmployeeAddTeacher;