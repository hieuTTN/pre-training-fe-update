import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import defaulavt from '../../assest/images/avatar.jpg'

var token = localStorage.getItem('token');

async function loadTeacherByToken(){
    var url = 'http://localhost:8080/api/lecture/lecture/get-my-infor';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function loadListClass(){
    var url = 'http://localhost:8080/api/class/lecture/class-by-lecturer';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function loadStudentByClass(classId){
    var url = 'http://localhost:8080/api/student/lecture/get-student-by-class?classId='+ classId;
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

function MyAccountInfor(){
    const [items, setItems] = useState(null);
    const [itemClass, setItemClass] = useState([]);
    const [itemStudent, setItemStudent] = useState([]);

    useEffect(()=>{
        const getMyInfor = async() =>{
            const response = await loadTeacherByToken();
            var result = await response.json();
            setItems(result)
        };
        getMyInfor();
        const getClass = async() =>{
            const response = await loadListClass();
            var result = await response.json();
            setItemClass(result)
        };
        getClass();
    }, []);

    
    async function loadStudent(idclass){
        const response = await loadStudentByClass(idclass);
        var result = await response.json();
        setItemStudent(result);
    }

    return (
        <div className='container contentmain'>
            <h3 className='text-center'>THÔNG TIN GIẢNG VIÊN</h3><br/>
        <Tabs >
            <TabList className='tablists'>
            <Tab className='tab-item'>Thông tin chung</Tab>
            <Tab className='tab-item'>Lớp giảng dạy</Tab>
            </TabList>

            <TabPanel className='tab-panel'>
            <div className='row'>
                <div className='col-sm-3'>
                    <div className='imgdivavt'>
                        <img className='avataracc' src={defaulavt}/>
                    </div>
                    <br/><span className='bold'>Số cmnd/ cccd</span>
                    <div className='blockcccd'>{items==null?"":items.profile.citizenIdentity==""?"":"Không"}</div>
                </div>
                <div className='col-sm-9 row'>
                    <div className='col-sm-4'>
                        <label>Họ và tên</label>
                        <div className='blockcccd'>{items==null?"":items.profile.fullname}</div>
                        <label>Ngày sinh</label>
                        <div className='blockcccd'>{items==null?"":items.profile.dob?.split("T")[0]}</div>
                        <label>Email</label>
                        <div className='blockcccd'>{items==null?"":items.profile.email}</div>
                    </div>
                    <div className='col-sm-4'>
                        <label>Mã giảng viên</label>
                        <div className='blockcccd'>{items==null?"":items.user.username}</div>
                        <label>Giới tính</label>
                        <div className='blockcccd'>{items==null?"":items.profile.gender==true?"Nam":"Nữ"}</div>
                        <label>Địa chỉ</label>
                        <div className='blockcccd'>{items==null?"":items.profile.address}</div>
                    </div>
                    <div className='col-sm-4'>
                        <label>Ngành dạy</label>
                        <div className='blockcccd'>{items==null?"":items.faculty==null?"Không có ngành dạy":items.faculty.name}</div>
                        <label>Chuyên môn</label>
                        <div className='blockcccd'>{items==null?"":items.profile.qualification}</div>
                    </div>
                </div>
            </div>
            </TabPanel>
            <TabPanel className='tab-panel'>
                <br/>
                <table className='table'>
                    <thead className='theadblue'>
                        <tr>
                            <th>STT</th>
                            <th>Tên lớp</th>
                            <th>Khoa</th>
                            <th>Danh sách</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemClass.map((item, index)=>{
                            return <tr>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.faculty.name}</td>
                                <td><span onClick={()=>{loadStudent(item.classId)}} data-bs-toggle="modal" data-bs-target="#liststudent" className='viewlist'>Xem danh sách</span></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </TabPanel>
        </Tabs>
        <div class="modal fade" id="liststudent" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Chọn file để import</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                        <table class="table table-striped tablefix">
                        <thead class="thead-tablefix">
                            <tr>
                                <th>id</th>
                                <th>Mã sinh viên</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                        {itemStudent.map(item=>{
                                return <tr id={"stdcol"+item.studentId}>
                                    <td>{item.studentId}</td>
                                    <td>{item.user.username}</td>
                                    <td>{item.profile.fullname}</td>
                                    <td>{item.profile.email}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAccountInfor;