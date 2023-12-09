import { useState, useEffect } from 'react'
import {loadAllUser,lockOrUnlock,loadAuthority,changeRole} from '../../../services/admin/user'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var size = 10
const AdminUser = ()=>{
    const [items, setItems] = useState([]);
    const [itemsAutho, setItemsAutho] = useState([]);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        const getUser = async(page, role) =>{
            const response = await loadAllUser(page, size,role);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getUser(0, "");

        const getAuthority = async() =>{
            const response = await loadAuthority();
            var result = await response.json();
            setItemsAutho(result)
        };
        getAuthority();
    }, []);


    const fetchUsers = async (page, role) => {
        const res = await loadAllUser(page, size,role);
        var result = await res.json();
        var totalPage = result.totalPages;
        setpageCount(totalPage);
        return result.content;
    };


    const handlePageClick = async (data)=>{
        var roles = "";
        if(document.getElementById("role")){
            roles = document.getElementById("role").value
        }
        var currentPage = data.selected
        const listUser = await fetchUsers(currentPage,roles);
        setItems(listUser);
    }

    async function loadByRole(){
        var roles = "";
        if(document.getElementById("role")){
            roles = document.getElementById("role").value
        }
        const listUser = await fetchUsers(0, roles)
        console.log(listUser)
        setItems(listUser);
    }

    async function changeRoleUser(){
        var id = document.getElementById("iduser").value
        var rolename = document.getElementById("rolelist").value
        var res = await changeRole(rolename, id);
        if(res.status < 300){
            toast.success("thay đổi quyền thành công")
            document.getElementById("btnclosemodal").click()
            loadByRole();
        }
        else{
            toast.error("thay đổi quyền thất bại")
        }
    }


    function setRole(rolename, id){
        document.getElementById("rolelist").value = rolename
        document.getElementById("iduser").value = id
    }
    
    return (
        <div>
            <div class="col-sm-12 header-sp">
                    <div class="row">
                        <div class="col-md-3 col-sm-6 col-6">
                            <label class="lb-form">Chọn quyền</label>
                            <select onChange={loadByRole} id="role" class="form-control">
                                <option value="">Tất cả quyền</option>
                                <option value="ROLE_ADMIN">Tài khoản admin</option>
                                <option value="ROLE_TEACHER">Tài khoản giảng viên</option>
                                <option value="ROLE_EMPLOYEE">Tài khoản nhân viên</option>
                                <option value="ROLE_STUDENT">Tài khoản sinh viên</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="wrapper">
                        <table class="table table-striped tablefix">
                            <thead class="thead-tablefix">
                                <tr>
                                    <th>id</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Ngày tạo</th>
                                    <th>Quyền</th>
                                    <th class="sticky-col">Khóa</th>
                                </tr>
                            </thead>
                            <tbody id="listuser">
                                {items.map((item=>{
                                    return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>{item.createdDate}</td>
                                    <td>{item.authorities.name}
                                    <i onClick={()=>setRole(item.authorities.name,item.id)} data-bs-toggle="modal" data-bs-target="#addtk" className='fa fa-edit faicon'></i></td>
                                    <td class="sticky-col">
                                    {item.actived == true?
                                    <button onClick={()=>lockOrUnlock(item.id, 1) } className='btn btn-primary'>Khóa</button>:
                                    <button onClick={()=>lockOrUnlock(item.id, 0) } className='btn btn-danger'>Mở khóa</button>} 
                                    </td>
                                </tr>
                                }))}
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


            <div class="modal fade" id="addtk" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thay đổi quyền</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <input id='iduser' type='hidden'/>
                            <select className='form-control' id='rolelist'>
                            {itemsAutho.map((item=>{
                                return <option value={item.name}>{item.name}</option>
                            }))}
                            </select>
                            <button onClick={()=>changeRoleUser()} className='btn btn-primary btnsubmit'>Thay đổi quyền</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUser;