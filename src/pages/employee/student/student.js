import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import logocard from '../../../assest/images/logo.png'

var size = 10;
var token = localStorage.getItem('token');
var urlAll = ""
async function loadAllStudent(page, param, facultyId){
    var url = 'http://localhost:8080/api/student/employee/get-all-student-by-faculty?size=' + size+'&sort=studentId,desc';
    if(param != null){
        url += '&search='+param;
    }
    if(facultyId != null) {url+= "&facultyId="+facultyId}
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

async function loadAllStudentByUrl(page){
    const response = await fetch(urlAll+'&page='+page, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function deleteStudent(id){
    var con = window.confirm("Xác nhận xóa sinh viên?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/student/employee/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    if(response.status < 300){
        toast.success("Xóa sinh viên thành công")
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


async function loadAllFaculty(){
    const response = await fetch('http://localhost:8080/api/faculty/all/find-all', {
        headers: new Headers({ 'Authorization': 'Bearer ' + token })
    });
    return response;
}

function getNameFaculty(name){
    var arr = name[0];
    var i = 0;
    for(i=0; i< name.length; i++){
        if(name[i] == ' '){
            arr += name[i+1];
        }
    }
    return arr
}

async function loadClassByFaculty(id){
    const response = await fetch('http://localhost:8080/api/class/employee/class-by-faculty?facultyId='+id, {
        headers: new Headers({ 'Authorization': 'Bearer ' + token })
    });
    return response;
}

async function readExcel(){
    document.getElementById("loading").style.display = 'block'

    const filePath = document.getElementById('fileEx')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    if(Number(filePath.files.length) == Number(0)){
        return;
    }
    var con = window.confirm("Xác nhận nhập file sinh viên?")
    if (con == false) {
        return;
    }
    var curyear = document.getElementById("curyear").value
    var url = 'http://localhost:8080/api/student/employee/save-by-file?year='+curyear;
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



function EmployeeStudent(){
    const [items, setItems] = useState([]);
    const [studentInfor, setStudentInfor] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [itemFaculty, setItemFaculty] = useState([]);
    const [itemClass, setItemClass] = useState([]);
    const [studentCard, setStudentCard] = useState(null);
    useEffect(()=>{
        const getStudent = async(page) =>{
            const response = await loadAllStudent(page,null,null);
            var result = await response.json();
            var totalPage = result.totalPages;
            setItems(result.content)
            setpageCount(totalPage);
        };
        getStudent(0,null,null);

        const getFaculty = async() =>{
            const response = await loadAllFaculty();
            var result = await response.json();
            var first = [{facultyId:"",name:"Tất cả khoa"}]
            setItemFaculty(first.concat(result))
        };
        getFaculty();
    }, []);


    const fetchStudent = async (page) => {
        const res = await loadAllStudentByUrl(page);
        var result = await res.json();
        var totalPage = result.totalPages;
        setItems(result.content)
        setpageCount(totalPage);
        return result.content;
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        const listStudent = await fetchStudent(currentPage);
        setItems(listStudent);
    }

    function setStdModal(std){
        setStudentInfor(std);
    }

    function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        var idFaculty = document.querySelector('input[name=faculty]').value
        var idClasses = document.querySelector('input[name=classes]').value
        urlAll = 'http://localhost:8080/api/student/employee/get-all-student-by-faculty?size=' + size+'&sort=studentId,desc';
        urlAll += '&search='+param
        if(idFaculty != "" && idFaculty != null){
            urlAll += '&facultyId='+idFaculty
        }
        if(idClasses != "" && idClasses != null){
            urlAll += '&classId='+idClasses
        }
        console.log(urlAll)
        fetchStudent(0);
    }

    async function hanleOnchangeFaculty(e){
        const response = await loadClassByFaculty(e.facultyId);
        var result = await response.json();
        setItemClass(result)
        urlAll = 'http://localhost:8080/api/student/employee/get-all-student-by-faculty?size=' + size+'&sort=studentId,desc';
        if(e.facultyId != "" && e.facultyId != null){
            urlAll += '&facultyId='+e.facultyId
        }
        else{
            setItemClass([])
        }
        fetchStudent(0);
    }

    async function hanleOnchangeClass(e){
        urlAll = 'http://localhost:8080/api/student/employee/get-all-student-by-faculty?size=' + size+'&sort=studentId,desc';
        if(e.classId != "" && e.classId != null){
            urlAll += '&classId='+e.classId
        }
        fetchStudent(0);
    }



    return (
        <div>
        <div className="col-sm-12 header-sp">
                <div className="row">
                    <div className="col-md-3 col-sm-6 col-6">
                        <a href='add-student' className='btn btn-primary'>Thêm sinh viên</a>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <button data-bs-toggle="modal" data-bs-target="#chooseFile" className='btn btn-primary'><i className='fa fa-file-excel'></i> Chọn file excel</button>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <AsyncSelect
                        name='faculty'
                        onChange={hanleOnchangeFaculty}
                        defaultOptions={itemFaculty} 
                        getOptionLabel={(itemFaculty)=>itemFaculty.name} 
                        getOptionValue={(itemFaculty)=>itemFaculty.facultyId} 
                        placeholder='chọn khoa'/>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <AsyncSelect
                        name='classes'
                        onChange={hanleOnchangeClass}
                        defaultOptions={itemClass} 
                        getOptionLabel={(itemClass)=>itemClass.name} 
                        getOptionValue={(itemClass)=>itemClass.classId} 
                        placeholder='chọn lớp'/>
                    </div>
                </div>
            </div>
            <div className="col-sm-12">
                <div className="wrapper">
                    <div className="headertable">
                        <div className="divsearchtb">
                            <label className='lbsearch'>search:</label>
                            <input onChange={searchByParam} id="searchtable" placeholder="tìm kiếm" className="inputsearchtable" />
                        </div>
                    </div>
                    <table className="table table-striped tablefix">
                        <thead className="thead-tablefix">
                            <tr>
                                <th>id</th>
                                <th>Mã sinh viên</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Lớp</th>
                                <th>Khoa</th>
                                <th className="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item=>{
                                return <tr>
                                    <td>{item.studentId}</td>
                                    <td className='stdcode' onClick={()=>setStdModal(item.studentInfor)} 
                                    data-bs-toggle="modal" data-bs-target="#studentinfor">
                                        {item.user.username}
                                    </td>
                                    <td>{item.profile.fullname}</td>
                                    <td>{item.profile.email}</td>
                                    <td>{item.profile.dob?.split("T")[0]}</td>
                                    <td>{item.profile.gender==true?"Nam":"Nữ"}</td>
                                    <td>{item.profile.phone}</td>
                                    <td>{item.profile.address}</td>
                                    <td>{item.classes==null?"":item.classes.name}</td>
                                    <td>{item.facultyName}</td>
                                    <td className="sticky-col">
                                        <a href={"add-student?id="+item.studentId}><i className='fa fa-edit iconaction'></i></a>
                                        <i onClick={()=>deleteStudent(item.studentId)} className='fa fa-trash iconaction'></i>
                                        <i onClick={()=>setStdModal(item.studentInfor)} data-bs-toggle="modal" data-bs-target="#studentinfor" className='fa fa-eye iconaction'></i>
                                        <i onClick={()=>setStudentCard(item)} data-bs-toggle="modal" data-bs-target="#studentCard" className='fa fa-print iconaction'></i>
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
            <div className="modal fade" id="studentinfor" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Chi tiết chúng tuyển</h5> <button id='btnclosemodal' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div className="modal-body row">
                        <table className="table table-striped tablefix">
                            <thead className="thead-tablefix">
                                <tr>
                                    <th>Tổ hợp chúng tuyển</th>
                                    <th>Thứ tự nguyện vọng</th>
                                    <th>Môn trúng tuyển</th>
                                    <th>Điểm ưu tiên</th>
                                    <th>Khu vực ưu tiên</th>
                                    <th>Năm tốt nghiệp</th>
                                    <th>Lực học</th>
                                    <th>Hạnh kiểm</th>
                                    <th>Điểm trung bình</th>
                                    <th>Mã tỉnh</th>
                                    <th>Mã trường</th>
                                    <th>Nơi sinh</th>
                                    <th>Dân tộc</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{studentInfor==null?"":studentInfor.combinationCode}</td>
                                    <td>{studentInfor==null?"":studentInfor.orderWish}</td>
                                    <td>{studentInfor==null?"":
                                    studentInfor.firstSubjectName+": "+studentInfor.firstMark+", "+
                                    studentInfor.secondSubjectName+": "+studentInfor.secondMark+", "+
                                    studentInfor.thirdSubjectName+": "+studentInfor.thirdMark+", "}</td>
                                    <td>{studentInfor==null?"":studentInfor.priorityMark}</td>
                                    <td>{studentInfor==null?"":studentInfor.priorityArea}</td>
                                    <td>{studentInfor==null?"":studentInfor.graduationYear}</td>
                                    <td>{studentInfor==null?"":studentInfor.rankedAcademic}</td>
                                    <td>{studentInfor==null?"":studentInfor.rankConduct}</td>
                                    <td>{studentInfor==null?"":studentInfor.avgMark}</td>
                                    <td>{studentInfor==null?"":studentInfor.provinceCode}</td>
                                    <td>{studentInfor==null?"":studentInfor.schoolCode}</td>
                                    <td>{studentInfor==null?"":studentInfor.placeOfBirth}</td>
                                    <td>{studentInfor==null?"":studentInfor.ethnicity}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="chooseFile" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Chọn file để import</h5> <button id='btnclosemodal' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div className="modal-body row">
                            <label>Năm học</label>
                            {/* <input id='curyear' type='number' className='form-control'/> */}
                            <select id='curyear' className='form-control'>
                                <option value={2023}>2023</option>
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                                <option value={2027}>2027</option>
                                <option value={2028}>2028</option>
                                <option value={2029}>2029</option>
                                <option value={2030}>2030</option>
                            </select>
                            <label>Chọn file excel</label>
                            <input id='fileEx' type='file' className='form-control'/>
                            <br/><br/>
                            <div id="loading">
                                <div className="bar1 bar"></div>
                            </div>
                            <br/><br/><br/><button onClick={readExcel} className='btn btn-primary form-control'>Nhập sinh viên</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="studentCard" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">In thẻ sinh viên</h5> <button id='btnclosemodal' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div id='bodycard' className="modal-body row">
                            <div className='row rowcard'>
                            <div id='cardinfor'>
                                <div className='cardtop'>
                                    <div className='cardlogo'>
                                        <img className='imglogocard' src={logocard}/>
                                    </div>
                                    <div className='cardtitle'>
                                        <h6 className='titlecard'>HỌC VIỆN<br/>CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</h6>
                                    </div>
                                </div>
                                <div className='main-infor-card'>
                                    <div className='main-card-left'>
                                        <img className='imgmaincard'  src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdzBNXI0NaKCGpv-i4YmwgpHXne7uaevY4Hw&usqp=CAU'/>
                                        <div className='stdcodecard'>
                                            <h6 className='sdtcodesd'>Mã SV</h6>
                                            <h6 className='sdtcodesd'>B203728</h6>
                                        </div>
                                    </div>
                                    <div className='main-card-right'>
                                        <p className='maintitle'><span className='tsv'>THẺ SINH VIÊN</span> <span className='tsvtt'>(TẠM THỜI)</span></p>
                                        <table>
                                            <tr><td colSpan={2}>
                                                    <span>Họ tên: <span className='boldtext'>{studentCard==null?"":studentCard.profile.fullname}</span></span>
                                            </td></tr>
                                            <tr>
                                                <td><span>Ngày sinh: <span className='boldtext'>{studentCard==null?"":studentCard.profile.dob?.split("T")[0]}</span></span></td>
                                                <td><span className='righttext'>Giới tính: <span className='boldtext'>{studentCard==null?"":studentCard.profile.gender==true?"Nam":"Nữ"}</span></span></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}><span className='blocktext'>HKTT: <span className='boldtext'>{studentCard==null?"":studentCard.profile.address}</span></span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Lớp: <span className='boldtext'>{studentCard==null?"":studentCard.classes==null?"":studentCard.classes.name}</span></span></td>
                                                <td><span className='righttext'>Hệ: <span className='boldtext'>ĐHCQ</span></span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Ngành: <span className='boldtext upcase'>{studentCard==null?"":getNameFaculty(studentCard.facultyName)}</span></span></td>
                                                <td><span className='righttext'>Khóa: <span className='boldtext'>{studentCard==null?"":studentCard.academicYear+"-"+Number(Number(studentCard.academicYear) + 4)}</span></span></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <button onClick={PrintElem} className='btn btn-primary btnprint'>In thẻ</button>
                    </div>
                </div>
            </div>
    </div>
    );
}

function PrintElem()
{
    var mywindow = window.open('', 'PRINT', 'height=600,width=1000');

    mywindow.document.write(`<html><head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
	<style>
	#cardinfor{
        border: 2px solid #d1d1d1;
        padding: 0px;
        padding-top: 7px;
        padding-bottom: 20px;
        width: 450px;
        margin: auto;
    }
    .main-infor-card{
        min-height:200px;
    }
    .cardtop{
        padding: 0px 10px 0px 10px;
        border-bottom: 1px solid #d1d1d1;
    }
    .titlecard{
        text-align: center;
    }
    .cardlogo{
        width: 40px;
        float: left;
    }
    .cardtitle{
        float: none;
        overflow: hidden;
    }
    .imglogocard{
        width: 40px;
    }
    .main-card-left{
        width: 25%;
        float: left;
        padding-top: 10px;
    }
    .imgmaincard{
        margin-left: 10px;
        width: 90%;
        object-fit: cover;
    }
    .sdtcodesd{
        display: block;
        text-align: center;
        margin-top:-3px;
    }
    .stdcodecard{
        margin-top: 5px;
        background-color: #fde8dd;
        padding: 2px 0px 1px 0px;
    }
    .maintitle{
        text-align: center;
    }
    .maintitle{
        font-weight: bold;
    }
    .tsv{
        font-size: 1.3rem;
        color: #96693d;
    }
    .tsvtt{
        font-size: 0.9rem;
        color: #c6a3a7;
    }
    .main-card-right{
        width: 65%;
        float: left;
        padding-left: 5px;
        padding-right: 5px;
    }
    .boldtext{
        font-weight: bold;
    }
    .blocktext{
        display: block;
    }
    .righttext{
        margin-left: 10px;
    }
    .upcase{
        text-transform: uppercase;
    }
    .btnprint{
        margin-top: 20px;
    }
	</style>
    </head>`);
    mywindow.document.write('<body>');
    mywindow.document.write(document.getElementById("bodycard").innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
    mywindow.focus();

    mywindow.print();
    mywindow.close();

    return true;
}
export default EmployeeStudent;