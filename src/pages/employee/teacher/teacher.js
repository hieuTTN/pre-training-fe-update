import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

var size = 10;
var token = localStorage.getItem('token');
var urlAll = ""
async function loadAllTeacher(page, param, facultyId){
    var url = 'http://localhost:8080/api/lecture/employee/search-lecturer?size=' + size+'&sort=lecturerId,desc';
    if(param != null){
        url += '&search='+param;
    }
    if(facultyId != null) {url+= "&faculty="+facultyId}
    urlAll = url;
    url += '&page='+page;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function loadAllFaculty(){
    const response = await fetch('http://localhost:8080/api/faculty/all/find-all', {
        headers: new Headers({ 'Authorization': 'Bearer ' + token })
    });
    return response;
}

async function loadAllTeacherByUrl(page){
    const response = await fetch(urlAll+'&page='+page, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function deleteTeacher(id){
    var con = window.confirm("Xác nhận xóa giảng viên?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/lecture/employee/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa giảng viên thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
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

function EmployeeTeacher(){
    const [items, setItems] = useState([]);
    const [itemFaculty, setItemFaculty] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getTeacher = async(page) =>{
            const response = await loadAllTeacher(page,null,null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getTeacher(0);
        const getFaculty = async() =>{
            const response = await loadAllFaculty();
            var result = await response.json();
            var first = [{facultyId:"",name:"Tất cả khoa"}]
            setItemFaculty(first.concat(result))
        };
        getFaculty();
    }, []);

    const fetchTeacher = async (page) => {
        const res = await loadAllTeacherByUrl(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    async function loadByFaculty(e){
        urlAll = 'http://localhost:8080/api/lecture/employee/search-lecturer?size=' + size+'&sort=lecturerId,desc';
        if(e.facultyId != null && e.facultyId != "") {
            urlAll+= "&faculty="+e.facultyId
        }
        const listTeacher = await fetchTeacher(0);
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        await fetchTeacher(currentPage);
    }

    async function searchByParam(e){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        urlAll = 'http://localhost:8080/api/lecture/employee/search-lecturer?size=' + size+'&sort=lecturerId,desc';
        var idFaculty = document.querySelector('input[name=faculty]').value
        if(idFaculty != null && idFaculty != "") {
            urlAll+= "&faculty="+idFaculty
        }
        urlAll +='&search='+param
        await fetchTeacher(0);
    }

    return (
        <div>
        <div class="col-sm-12 header-sp">
                <div class="row">
                    <div class="col-md-3 col-sm-6 col-6">
                        <a href='add-teacher' className='btn btn-primary'>Thêm giảng viên</a>
                    </div>
                    <div className='col-md-4 col-sm-6 col-6'>
                    <Select name='faculty'
                    onChange={loadByFaculty}
                    options={itemFaculty} 
                    getOptionLabel={(itemFaculty)=>itemFaculty.name} 
                    getOptionValue={(itemFaculty)=>itemFaculty.facultyId}  
                    placeholder="Lọc theo khoa"/>
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="wrapper">
                    <div class="headertable">
                        <div class="divsearchtb">
                            <label className='lbsearch'>search:</label>
                            <input onChange={searchByParam} id="searchtable" placeholder="tìm kiếm" class="inputsearchtable" />
                        </div>
                    </div>
                    <table class="table table-striped tablefix">
                        <thead class="thead-tablefix">
                            <tr>
                                <th>id</th>
                                <th>Mã giảng viên</th>
                                <th>Học vị</th>
                                <th>Họ tên</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Số cccd</th>
                                <th>Khoa</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item=>{
                                return <tr>
                                    <td>{item.lecturerId}</td>
                                    <td>{item.user.username}</td>
                                    <td>{item.degree!=null?item.degree.name:""}</td>
                                    <td>{item.profile.fullname}</td>
                                    <td>{item.profile.dob?.split("T")[0]}</td>
                                    <td>{item.profile.gender==true?"Nam":"Nữ"}</td>
                                    <td>{item.profile.email}</td>
                                    <td>{item.profile.phone}</td>
                                    <td>{item.profile.address}</td>
                                    <td>{item.profile.citizenIdentity}</td>
                                    <td>{item.faculty.name}</td>
                                    <td class="sticky-col">
                                        <a href={"add-teacher?id="+item.lecturerId}><i className='fa fa-edit iconaction'></i></a>
                                        <i onClick={()=>deleteTeacher(item.lecturerId)} className='fa fa-trash iconaction'></i>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate 
                marginPagesDisplayed={2} 
                pageCount={pageCount} 
                onPageChange={handlePageClick}
                containerClassName={'pagination'} 
                pageClassName={'page-item'} 
                pageLinkClassName={'page-link'}
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                breakClassName='page-item'
                breakLinkClassName='page-link'  
                activeClassName='active'/>
            </div>
    </div>
    );
}

export default EmployeeTeacher;