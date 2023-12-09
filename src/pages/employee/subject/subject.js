import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


var size = 10;
var token = localStorage.getItem('token');
async function loadAllSubject(page, param){
    var url = 'http://localhost:8080/api/subject/employee/get-all-subject?page=' + page + '&size=' + size+'&sort=subjectId,desc';
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

async function deleteSubject(id){
    var con = window.confirm("Xác nhận xóa môn học?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/subject/employee/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa môn học thành công")
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

async function readExcel(){
    document.getElementById("loading").style.display = 'block'

    const filePath = document.getElementById('fileEx')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    if(Number(filePath.files.length) == Number(0)){
        return;
    }
    var con = window.confirm("Xác nhận xóa môn học?")
    if (con == false) {
        return;
    }

    var url = 'http://localhost:8080/api/subject/employee/save-by-file';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
        body: formData
    });
    if(response.status < 300){
        toast.success("Thành công")
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
    else{
        if(response.status == 417){
            var result  = await response.json();
            toast.error(result.errorMessage)
        } 
        else{
            toast.error("Thất bại")
        }
    }
    document.getElementById("loading").style.display = 'none'
}



function EmployeeSubject(){
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getSubject = async(page) =>{
            const response = await loadAllSubject(page,null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getSubject(0);
    }, []);


    const fetchSubject = async (page, param) => {
        const res = await loadAllSubject(page, param);
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
        const listSubject = await fetchSubject(currentPage,param);
        setItems(listSubject);
    }

    function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        fetchSubject(0, param);
    }

    function openFile(){
        document.getElementById("fileEx").click();
    }

    return (
        <div>
        <div class="col-sm-12 header-sp">
                <div class="row">
                    <div class="col-md-3 col-sm-6 col-6">
                        <a href='add-subject' className='btn btn-primary'>Thêm môn học</a>
                    </div>
                    <div class="col-md-3 col-sm-6 col-6">
                        <button onClick={openFile} className='btn btn-primary'><i className='fa fa-file-excel'></i> Chọn file excel</button>
                        <input onChange={readExcel} accept='.xlsx,.csv' id='fileEx' type="file" className='unvisible'/>
                    </div>
                </div>
                <div id="loading">
                    <div class="bar1 bar"></div>
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
                                <th>Tên môn học</th>
                                <th>Mã môn học</th>
                                <th>Môn tiên quyết</th>
                                <th>Số tín chỉ</th>
                                <th>Số buổi thực hành</th>
                                <th>Số buổi lý thuyểt</th>
                                <th>Số buổi bài tập</th>
                                <th>Số buổi tự học</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item=>{
                            return  <tr>
                                        <td>{item.subjectId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.subjectCode}</td>
                                        <td>{item.prerequisite != null?item.prerequisite.subjectCode:""}</td>
                                        <td>{item.creditNum}</td>
                                        <td>{item.practicalNum}</td>
                                        <td>{item.theoryNum}</td>
                                        <td>{item.numExercise}</td>
                                        <td>{item.numSelfLearning}</td>
                                        <td class="sticky-col">
                                            <a href={"add-subject?id="+item.subjectId}><i className='fa fa-edit iconaction'></i></a>
                                            <i onClick={()=>deleteSubject(item.subjectId)} className='fa fa-trash iconaction'></i>
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

export default EmployeeSubject;