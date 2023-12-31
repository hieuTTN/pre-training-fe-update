import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import {requestGet, requestPost} from '../../../services/request';
import Select from 'react-select';

var token = localStorage.getItem('token');
async function loadAllMajor(param){
    var url = 'http://localhost:8080/api/major/all/find-all';
    if(param != null){
        url += "?search="+param;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function loadAllSubject(){
    var url = 'http://localhost:8080/api/subject/employee/get-all-subject-list';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function saveMajorSubject(event){
    event.preventDefault();
    var listSubject = event.target.elements.subject;
    var arrSubjectId = [];
    var i=0;
    for(i=0; i<listSubject.length; i++){
        arrSubjectId.push(listSubject[i].value)
    }
    const payload = { 
        majorId:document.getElementById("idmajor").value,
        semester:event.target.elements.hocky.value,
        schoolYear:event.target.elements.namhoc.value,
        listSubjectId:arrSubjectId
    }
    var url = 'http://localhost:8080/api/subject-major/employee/create-or-update'
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
        window.location.reload();
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.errorMessage);
    }
}

async function deleteSubjectMajor(id){
    var con = window.confirm("Xác nhận xóa môn học học này?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/subject-major/employee/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa môn học thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        document.getElementById("subcol"+id).style.display = 'none'
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Xóa thất bại")
        }
    }
}

function EmployeeFaculty(){
    const [items, setItems] = useState([]);
    const [itemSucjectMajor, setItemSucjectMajor] = useState([]);
    const [itemSubject, setItemSubject] = useState([]);
    useEffect(()=>{
        const getFaculty = async() =>{
            const response = await loadAllMajor(null);
            var result = await response.json();
            setItems(result)
        };
        getFaculty();

        const getSubjectSelect = async() =>{
            const response = await loadAllSubject();
            var result = await response.json();
            setItemSubject(result)
        };
        getSubjectSelect();
    }, []);

    async function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        const response = await loadAllMajor(param);
        var result = await response.json();
        setItems(result)
    }

    async function loadSubjectByMajor(idmajor, item){
        document.getElementById("idmajor").value = idmajor
        const response = await requestGet('http://localhost:8080/api/subject-major/employee/get-subject-major?id='+idmajor);
        var result = await response.json();
        setItemSucjectMajor(result)
        document.getElementById("tencn").innerHTML = "( Ngành "+item.name+")"
    }

    return (
        <div>
        <div class="col-sm-12">
            <div class="wrapper">
                <div class="headertable">
                    <div class="divsearchtb">
                        <label className='lbsearch'>search:</label>
                        <input onKeyUp={searchByParam} id="searchtable" placeholder="tìm kiếm" class="inputsearchtable" />
                    </div>
                </div>
                <table class="table table-striped tablefix">
                    <thead class="thead-tablefix">
                        <tr>
                            <th>id</th>
                            <th>Tên khoa</th>
                            <th>Tên chuyên ngành</th>
                            <th>Sinh viên đã có lớp</th>
                            <th>Sinh viên chưa có lớp</th>
                            <th class="sticky-col">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item=>{
                            return <tr>
                                <td>{item.id}</td>
                                <td>{item.faculty.name}</td>
                                <td>{item.name}</td>
                                <td>{item.numStudent}</td>
                                <td>{item.numStudentNotClass}</td>
                                <td class="sticky-col">
                                    <i onClick={()=>loadSubjectByMajor(item.id, item)} data-bs-toggle="modal" data-bs-target="#listSubject" className='fa fa-edit iconaction'></i>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal fade" id="listSubject" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Danh sách môn học <span id='tencn'></span></h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                    <div class="modal-body row">
                        <div className='col-sm-4'>
                            <form method='post' onSubmit={saveMajorSubject}>
                                <input id='idmajor' type='hidden'/>
                                <label>Chọn học kỳ</label>
                                <select name='hocky' className='form-control'>
                                    <option value={1}>Học kỳ 1</option>
                                    <option value={2}>Học kỳ 2</option>
                                </select>
                                <label>Chọn năm học</label>
                                <select name='namhoc' className='form-control'>
                                    <option value={1}>Năm học 1</option>
                                    <option value={2}>Năm học 2</option>
                                    <option value={3}>Năm học 3</option>
                                    <option value={4}>Năm học 4</option>
                                    <option value={5}>Năm học 5</option>
                                </select>
                                <label>Chọn môn học</label>
                                <Select  name='subject'
                                isMulti
                                options={itemSubject} 
                                getOptionLabel={(itemSubject)=>itemSubject.name} 
                                getOptionValue={(itemSubject)=>itemSubject.subjectId}  
                                placeholder="Chọn môn học"/>
                                <br/><br/><button className='btn btn-primary form-control'>Thêm vào chuyên ngành</button>
                            </form>
                        </div>
                        <div className='col-sm-8'>
                            <table class="table table-striped tablefix">
                                <thead class="thead-tablefix">
                                    <tr>
                                        <th>Mã môn học</th>
                                        <th>Tên môn học</th>
                                        <th>Số tín chỉ</th>
                                        <th>Học kỳ</th>
                                        <th>Năm học</th>
                                        <th class="sticky-col">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemSucjectMajor.map(item=>{
                                        return <tr id={"subcol"+item.id}>
                                            <td>{item.subject.subjectCode}</td>
                                            <td>{item.subject.name}</td>
                                            <td>{item.subject.creditNum}</td>
                                            <td>{item.semester}</td>
                                            <td>{item.schoolYear}</td>
                                            <td class="sticky-col">
                                                <i onClick={()=>deleteSubjectMajor(item.id)} className='fa fa-trash iconaction'></i>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

export default EmployeeFaculty;