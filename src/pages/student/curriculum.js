import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AsyncSelect from 'react-select/async';
import {requestGet, requestPost} from '../../services/request';

var token = localStorage.getItem('token');

async function loadStudentByToken(){
    var url = 'http://localhost:8080/api/student/student/my-infor';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

async function loadSubject(param){
    var url = 'http://localhost:8080/api/student/student/my-infor';
    const res = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var std = await res.json();
    var namhoc = std.academicYear;
    if(param == null){
        param = "";
    }
    var url = 'http://localhost:8080/api/subject-major/student/get-subject-classId-or-name?search='+param;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    console.log(list);
    var main = '';
    var index = 0;
    for(var i=0; i< list.length;i++){

        var tennamhoc = (Number(namhoc)+Number(list[i][0].schoolYear)-1) +" - "+(Number(namhoc)+Number(list[i][0].schoolYear));

        main += `<tr class="bkgd"><td colspan=8 class="bold-text">Học kỳ ${list[i][0].semester} , năm học ${tennamhoc}</td></tr>`
        for(var j=0; j<list[i].length; j++){
            main += `<tr>
            <td>${++index}</td>
            <td>${list[i][j].subject.subjectCode}</td>
            <td>${list[i][j].subject.name}</td>
            <td>${list[i][j].subject.creditNum}</td>
            <td>${list[i][j].subject.theoryNum}</td>
            <td>${list[i][j].subject.practicalNum}</td>
            <td>${list[i][j].subject.numExercise}</td>
            <td>${list[i][j].subject.prerequisite == null?"":list[i][j].subject.prerequisite.subjectCode}</td>
            </tr>`
        }
    }
    document.getElementById("listcur").innerHTML = main
    // return response;
}


function LoadCurriculum(){
    const [items, setItems] = useState(null);
    const [itemSubject, setItemSubject] = useState([]);

    useEffect(()=>{
        const getMyInfor = async() =>{
            const response = await loadStudentByToken();
            var result = await response.json();
            setItems(result)
        };
        getMyInfor();
        const getSubject = async() =>{
            const response = await loadSubject(null);
            // var result = await response.json();
            // setItemSubject(result)
        };
        getSubject();
    }, []);
    console.log(itemSubject);

    async function searchByParam(){
        var param = "";
        if(document.getElementById("searchtable")){
            param = document.getElementById("searchtable").value
        }
        const response = await loadSubject(param);
        var result = await response.json();
        setItemSubject(result)
    }

    return (
        <div className='container'>
            <div className='col-sm-6 std-block'>
                <div className='inner-std-block'>
                    <table className='table'>
                        <tr>
                            <td>Mã sinh viên</td>
                            <td className='textblod'>{items==null?"":items.user.username}</td>
                        </tr>
                        <tr>
                            <td>Tên sinh viên</td>
                            <td className='textblod'>{items==null?"":items.profile.fullname}</td>
                        </tr>
                        <tr>
                            <td>Giới tính</td>
                            <td>{items==null?"":items.profile.gender==true?"Nam":"Nữ"}</td>
                        </tr>
                        <tr>
                            <td>Quê quán</td>
                            <td>{items==null?"":items.profile.address}</td>
                        </tr>
                        <tr>
                            <td>Lớp</td>
                            <td>{items==null?"":items.classes==null?"":items.classes.name}</td>
                        </tr>
                        <tr>
                            <td>Ngành</td>
                            <td className='textblod'>{items==null?"":items.classes==null?items.facultyName:items.classes.major.name}</td>
                        </tr>
                        <tr>
                            <td>Khóa học</td>
                            <td className='textblod'>{items==null?"":items.academicYear+"-"+Number(Number(items.academicYear)+4)}</td>
                        </tr>
                        <tr>
                            <td>Hệ đào tạo</td>
                            <td>Đại học chính quy</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div className='ctdt-block'>
                <table className='table tablectdt'>
                    <thead className='theadblue'>
                        <tr>
                            <th>STT</th>
                            <th>Mã môn học</th>
                            <th>Tên môn học</th>
                            <th>Số TC</th>
                            <th>Số LT</th>
                            <th>Số TH</th>
                            <th>Số BT</th>
                            <th>Môn tiên quyết</th>
                        </tr>
                    </thead>
                    <tbody id='listcur'>
                        {/* {itemSubject.map((item)=>{
                            {item.map((items, index)=>{
                                return <tr>
                                <td>1</td>
                            </tr>
                            })}
                        })} */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoadCurriculum;