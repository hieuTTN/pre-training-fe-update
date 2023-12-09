import {toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import 'react-toastify/dist/ReactToastify.css';
var token = localStorage.getItem('token');


var uls = new URL(document.URL)
var id = uls.searchParams.get("id");

async function saveStudent(event){
    event.preventDefault();
    const payload = {
        student:id,
        studentCode: event.target.elements.studentCode.value,
        academicYear: event.target.elements.academicYear.value,
        fullname: event.target.elements.fullname.value,
        facultyName: event.target.elements.facultyName.value,
        DOB: event.target.elements.dOB.value,
        gender: event.target.elements.gender.value,
        email: event.target.elements.email.value,
        phone: event.target.elements.phone.value,
        address: event.target.elements.address.value,
        citizenIdentity: event.target.elements.citizenIdentity.value,
        combinationCode: event.target.elements.combinationCode.value,
        orderWish: event.target.elements.orderWish.value,
        firstSubjectName: event.target.elements.firstSubjectName.value,
        secondSubjectName: event.target.elements.secondSubjectName.value,
        thirdSubjectName: event.target.elements.thirdSubjectName.value,
        firstMark: event.target.elements.firstMark.value,
        secondMark: event.target.elements.secondMark.value,
        thirdMark: event.target.elements.thirdMark.value,
        priorityMark: event.target.elements.priorityMark.value,
        priorityArea: event.target.elements.priorityArea.value,
        graduationYear: event.target.elements.graduationYear.value,
        rankedAcademic: event.target.elements.rankedAcademic.value,
        rankConduct: event.target.elements.rankConduct.value,
        avgMark: event.target.elements.avgMark.value,
        provinceCode: event.target.elements.provinceCode.value,
        schoolCode: event.target.elements.schoolCode.value,
        placeOfBirth: event.target.elements.placeOfBirth.value,
        ethnicity: event.target.elements.ethnicity.value,
        changePass: id==null?false:event.target.elements.changePass.checked
    };
    var url = 'http://localhost:8080/api/student/employee/create'
    if(id != null){
        url = 'http://localhost:8080/api/student/employee/update?';
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
        window.location.href = 'student';
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.errorMessage);
    }
}

async function loadStudent(){
    if(id != null){
        var url = 'http://localhost:8080/api/student/employee/find-by-id?id='+id
        const response = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        return response;
    }
    return null;
}

const EmployeeAddStudent = ()=>{
    const [student, setStudent] = useState(null);

    useEffect(()=>{
        const getStudent = async() =>{
            const response = await loadStudent();
            if(response == null){
                setStudent(null);
            }
            else{
                var result = await response.json();
                setStudent(result)
            }
        };
        getStudent();

    },[]);



    return(
        <form onSubmit={saveStudent} className='row' method='post'>
            <h4>Thêm/ cập nhật sinh viên</h4>
            <div className="col-sm-4">
                <label className="lb-form">Mã sinh viên</label>
                <input defaultValue={student==null?"":student.user.username} name="studentCode" className="form-control" />
                <label className="lb-form">Tên sinh viên</label>
                <input defaultValue={student==null?"":student.profile.fullname} name="fullname" className="form-control" />
                <label className="lb-form">Năm học</label>
                <input defaultValue={student==null?"":student.academicYear} name="academicYear" className="form-control" />
                <label className="lb-form">Tên khoa</label>
                <input defaultValue={student==null?"":student.facultyName} name="facultyName" className="form-control" />
                <label className="lb-form">Ngày sinh</label>
                <input defaultValue={student==null?"":student.profile.dob?.split("T")[0]} name="dOB" type='date' className="form-control" />
                <label className="lb-form">Giới tính</label>
                <select defaultValue={student==null?"":student.profile.gender} className="form-control" name='gender'>
                    <option value={true}>Nam</option>
                    <option value={false}>Nữ</option>
                </select>
            </div>
            <div className="col-sm-4">
                <label className="lb-form">email</label>
                <input defaultValue={student==null?"":student.profile.email} name="email" type='email' className="form-control" />
                <label className="lb-form">số điện thoại</label>
                <input defaultValue={student==null?"":student.profile.phone} name="phone" className="form-control" />
                <label className="lb-form">Địa chỉ</label>
                <input defaultValue={student==null?"":student.profile.address} name="address" className="form-control" />
                <label className="lb-form">Nơi sinh</label>
                <input defaultValue={student==null?"":student.studentInfor.placeOfBirth} name="placeOfBirth" className="form-control" />
                <label className="lb-form">Số cccd</label>
                <input defaultValue={student==null?"":student.profile.citizenIdentity} name="citizenIdentity" className="form-control" />
                {
                 id==null?"": <label class="checkbox-custom">Đổi mật khẩu theo ngày sinh
                                <input name='changePass' type="checkbox"/>
                                <span class="checkmark-checkbox"></span>
                            </label>   
                }
                <br/><br/><button className='btn btn-primary form-control'>Thêm/ cập nhật sinh viên</button>
            </div>
            <div className="col-sm-4 row">
                    <div className='col-sm-6'>
                        <label className="lb-form">Mã tổ hợp thi</label>
                        <input defaultValue={student==null?"":student.studentInfor.combinationCode} name="combinationCode" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">TT Nguyện vọng</label>
                        <input defaultValue={student==null?"":student.studentInfor.orderWish} name="orderWish" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Tên Môn 1</label>
                        <input defaultValue={student==null?"":student.studentInfor.firstSubjectName} name="firstSubjectName" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Điểm Môn 1</label>
                        <input defaultValue={student==null?"":student.studentInfor.firstMark} name="firstMark" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Tên Môn 2</label>
                        <input defaultValue={student==null?"":student.studentInfor.secondSubjectName} name="secondSubjectName" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Điểm Môn 2</label>
                        <input defaultValue={student==null?"":student.studentInfor.secondMark} name="secondMark" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Tên Môn 3</label>
                        <input defaultValue={student==null?"":student.studentInfor.thirdSubjectName} name="thirdSubjectName" className="form-control" />
                    </div>
                    <div className='col-sm-6'>
                        <label className="lb-form">Điểm Môn 3</label>
                        <input defaultValue={student==null?"":student.studentInfor.thirdMark} name="thirdMark" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Điểm ưu tiên</label>
                        <input defaultValue={student==null?"":student.studentInfor.priorityMark} name="priorityMark" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Khu vực ưu tiên</label>
                        <input defaultValue={student==null?"":student.studentInfor.priorityArea} name="priorityArea" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Năm tốt nghiệp</label>
                        <input defaultValue={student==null?"":student.studentInfor.graduationYear} name="graduationYear" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Xếp loại học lực</label>
                        <input defaultValue={student==null?"":student.studentInfor.rankedAcademic} name="rankedAcademic" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Xếp loại hạnh kiểm</label>
                        <input defaultValue={student==null?"":student.studentInfor.rankConduct} name="rankConduct" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Điểm TB 12</label>
                        <input defaultValue={student==null?"":student.studentInfor.avgMark} name="avgMark" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Mã tỉnh</label>
                        <input defaultValue={student==null?"":student.studentInfor.provinceCode} name="provinceCode" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Mã trường</label>
                        <input defaultValue={student==null?"":student.studentInfor.schoolCode} name="schoolCode" className="form-control" />
                    </div>
                    <div className='col-sm-4'>
                        <label className="lb-form">Dân tộc</label>
                        <input defaultValue={student==null?"":student.studentInfor.ethnicity} name="ethnicity" className="form-control" />
                    </div>
            </div>
        </form>
    );
}

export default EmployeeAddStudent;