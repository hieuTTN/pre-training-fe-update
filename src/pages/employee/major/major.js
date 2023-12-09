import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {requestGet, requestPost} from '../../../services/request';
import Select from 'react-select';

var size = 10;
var token = localStorage.getItem('token');
var urlAll = ''
async function loadAllMajor(page, idfaculty){
    var url = 'http://localhost:8080/api/major/employee/all?page=' + page + '&size=' + size;
    if(idfaculty != '' && idfaculty != null){
        url += '&facultyId='+idfaculty
    }
    urlAll =  'http://localhost:8080/api/major/employee/all?size=' + size;
    const response = await requestGet(url);
    return response;
}

async function deleteMajor(id){
    var con = window.confirm("Xác nhận xóa chuyên ngành?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/major/employee/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa thành công")
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

async function saveMajor(event){
    event.preventDefault();
    const payload = {
        id:event.target.elements.id.value,
        name:event.target.elements.majorName.value,
        faculty:{facultyId:event.target.elements.faculty.value}
    };
    var url = 'http://localhost:8080/api/major/employee/create-update'
    const response = await requestPost(url, payload);
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


function EmployeeMajor(){
    const [items, setItems] = useState([]);
    const [itemFaculty, setItemFaculty] = useState([]);
    const [itemFacultySe, setItemFacultySe] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [major, setMajor] = useState(null);
    const [faculty, setFaculty] = useState(null);
    useEffect(()=>{
        const getSubject = async(page) =>{
            const response = await loadAllMajor(page,null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getSubject(0);
        const getFaculty = async() =>{
            const response = await requestGet('http://localhost:8080/api/faculty/all/find-all');
            var list = await response.json();
            setItemFaculty(list)
            var first = [{facultyId:"",name:"Tất cả khoa"}]
            setItemFacultySe(first.concat(list))
        };
        getFaculty();
    }, []);


    async function fetchMajor(e, page){
        var idfaculty = e.facultyId
        urlAll = 'http://localhost:8080/api/major/employee/all?size=' + size+'&facultyId='+idfaculty;
        loadAllMajorByUrl(0);
    };

    async function loadAllMajorByUrl(page){
        const response = await fetch(urlAll+'&page='+page, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
            })
        });
        var result = await response.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
    }


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        await loadAllMajorByUrl(currentPage);
    }

    function clearData(){
        document.getElementById("idcn").value = ''
        document.getElementById("tencn").value = ''
    }

    function setMaj(item){
        setMajor(item)
        setFaculty(item.faculty);
    }

    return (
        <div>
        <div class="col-sm-12 header-sp">
                <div class="row">
                    <div class="col-md-3 col-sm-6 col-6">
                        <button onClick={()=>clearData()} data-bs-toggle="modal" data-bs-target="#addmajor" href='add-subject' className='btn btn-primary'>Thêm chuyên ngành</button>
                    </div>
                    <div class="col-md-4 col-sm-6 col-6">
                    <Select
                        id='idfacultyselect'
                        onChange={fetchMajor}
                        name='idfacultyselect'
                        options={itemFacultySe} 
                        getOptionLabel={(itemFacultySe)=>itemFacultySe.name} 
                        getOptionValue={(itemFacultySe)=>itemFacultySe.facultyId}  
                        placeholder="Lọc theo khoa"
                        />
                    </div>
                </div>
            </div>
            <div class="col-sm-12">
                <div class="wrapper">
                    <table class="table table-striped tablefix">
                        <thead class="thead-tablefix">
                            <tr>
                                <th>id</th>
                                <th>Tên chuyên ngành</th>
                                <th>Khoa</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item=>{
                            return  <tr>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.faculty.name}</td>
                                        <td class="sticky-col">
                                            <i onClick={()=>setMaj(item)} data-bs-toggle="modal" data-bs-target="#addmajor" className='fa fa-edit iconaction'></i>
                                            <i onClick={()=>deleteMajor(item.id)} className='fa fa-trash iconaction'></i>
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

            <div class="modal fade" id="addmajor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thêm/ cập nhật chuyên ngành</h5> <button id='btnclosemodal' type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <form onSubmit={saveMajor} method='post' class="modal-body row">
                            <input id='idcn' defaultValue={major!=null?major.id:''} type='hidden' name='id' />
                            <label>Tên chuyên ngành</label>
                            <input id='tencn' defaultValue={major!=null?major.name:''} name='majorName' className='form-control' />
                            <label>Khoa</label>
                            <Select
                            value={faculty}
                             onChange={(item) => {
                                setFaculty(item);
                            }}
                            name='faculty'
                            options={itemFaculty} 
                            getOptionLabel={(itemFaculty)=>itemFaculty.name} 
                            getOptionValue={(itemFaculty)=>itemFaculty.facultyId}  
                            placeholder="Chọn khoa"
                            />
                            <br/><br/><button className='btn btn-primary form-control'>Thêm/ cập nhật chuyên ngành</button>
                        </form>
                    </div>
                </div>
            </div>
    </div>
    );
}

export default EmployeeMajor;