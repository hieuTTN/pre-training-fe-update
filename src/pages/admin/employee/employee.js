import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var size = 10
var token = localStorage.getItem('token');
async function loadAllEmployee(page, param){
    var url = 'http://localhost:8080/api/employee/admin/find-all?page=' + page + '&size=' + size;
    if(param != null){
        url += '&search='+param;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function deleteEmployee(id){
    var con = window.confirm("Xác nhận xóa nhân viên?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/employee/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa nhân viên thành công")
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


const AdminEmployee = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        const getEmployee = async(page) =>{
            const response = await loadAllEmployee(page,null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getEmployee(0);
    }, []);

    const fetchEmployee = async (page, param) => {
        const res = await loadAllEmployee(page, param);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        var currentPage = data.selected
        const listEmployee = await fetchEmployee(currentPage,param);
        setItems(listEmployee);
    }

    function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        fetchEmployee(0, param);
    }


    return(
        <div>
        <div class="col-sm-12 header-sp">
                <div class="row">
                    <div class="col-md-3 col-sm-6 col-6">
                        <a href='add-employee' className='btn btn-primary'>Thêm nhân viên</a>
                    </div>
                </div>
            </div>
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
                                <th>Họ tên</th>
                                <th>Tên đăng nhập</th>
                                <th>Ngày tạo</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Căn cước</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item=>{
                            return  <tr>
                                        <td>{item.employeeId}</td>
                                        <td>{item.profile.fullname}</td>
                                        <td>{item.user.username}</td>
                                        <td>{item.user.createdDate}</td>
                                        <td>{item.profile.dob?.split("T")[0]}</td>
                                        <td>{item.profile.gender == true?"Nam":"Nữ"}</td>
                                        <td>{item.profile.email}</td>
                                        <td>{item.profile.phone}</td>
                                        <td>{item.profile.citizenIdentity}</td>
                                        <td class="sticky-col">
                                            <a href={"add-employee?id="+item.employeeId}><i className='fa fa-edit iconaction'></i></a>
                                            <i onClick={()=>deleteEmployee(item.employeeId)} className='fa fa-trash iconaction'></i>
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

export default AdminEmployee;