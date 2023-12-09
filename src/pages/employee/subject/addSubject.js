import {toast } from 'react-toastify';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import 'react-toastify/dist/ReactToastify.css';
var token = localStorage.getItem('token');


var uls = new URL(document.URL)
var idSub = uls.searchParams.get("id");

async function saveSubject(event){
    event.preventDefault();
    const payload = {
        name: event.target.elements.subname.value,
        subjectCode: event.target.elements.subjectCode.value,
        creditNum: event.target.elements.creditNum.value,
        theoryNum: event.target.elements.theoryNum.value,
        numExercise: event.target.elements.numExercise.value,
        practicalNum: event.target.elements.practicalNum.value,
        numSelfLearning: event.target.elements.numSelfLearning.value,
        subjectParent: event.target.elements.subjectParent.value==""?null:event.target.elements.subjectParent.value,
        // changePass: idemp==null?false:event.target.elements.changePass.checked
    };
    var url = 'http://localhost:8080/api/subject/employee/create'
    if(idSub != null){
        url = 'http://localhost:8080/api/subject/employee/update?id='+idSub;
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
        window.location.href = 'subject';
    }
    if (response.status == 417) {
        var result = await response.json()
        toast.warning(result.errorMessage);
    }
}

async function loadSubject(){
    if(idSub != null){
        var url = 'http://localhost:8080/api/subject/employee/find-by-id?id='+idSub
        const response = await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        return response;
    }
    return null;
}

async function loadAllSubjectSelect(){
    var url = 'http://localhost:8080/api/subject/employee/get-all-subject-list';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    return response;
}

const AdminAddEmployee = ()=>{
    const [subject, setSubject] = useState(null);
    const [subSelect, setSubSelect] = useState([]);
    const [initSelect, setInitSelect] = useState({subjectId:"",name:"Không có môn học nào"});
    useEffect(()=>{

        const getSubject = async() =>{
            const response = await loadSubject();
            if(response == null){
                setSubject(null);
            }
            else{
                var result = await response.json();
                setSubject(result)
                if(result.prerequisite != null){
                    setInitSelect({subjectId:result.prerequisite.subjectId,name:result.prerequisite.name})
                }
            }
        };
        getSubject();

        console.log(initSelect)
        const getSubjectSelect = async() =>{
            const response = await loadAllSubjectSelect();
            var result = await response.json();
            var res = [
                {
                    subjectId:"",
                    name:"Không có môn học nào"
                }
            ]
            var result = res.concat(result)
            setSubSelect(result)
        };
        getSubjectSelect();

    },[]);

    console.log(initSelect)

    return(
        <form onSubmit={saveSubject} className='row' method='post'>
            <h4>Thêm/ cập nhật môn học</h4>
            <div className="col-sm-5">
                <label className="lb-form">Tên môn học</label>
                <input defaultValue={subject!=null?subject.name:""} name="subname" className="form-control" />
                <label className="lb-form">Mã môn học</label>
                <input defaultValue={subject!=null?subject.subjectCode:""} name="subjectCode" className="form-control" />
                <label className="lb-form">Số tín chỉ</label>
                <input defaultValue={subject!=null?subject.creditNum:""} name="creditNum" className="form-control" />
                <label className="lb-form">Số buổi lý thuyết</label>
                <input defaultValue={subject!=null?subject.theoryNum:""} name="theoryNum" className="form-control" />
                <label className="lb-form">Số buổi bài tập</label>
                <input defaultValue={subject!=null?subject.numExercise:""} name="numExercise" className="form-control" />
            </div>
            <div className="col-sm-5">
                <label className="lb-form">Số buổi thực hành</label>
                <input defaultValue={subject!=null?subject.practicalNum:""} name="practicalNum" className="form-control" />
                <label className="lb-form">Số buổi tự học</label>
                <input defaultValue={subject!=null?subject.numSelfLearning:""} name="numSelfLearning" className="form-control" />
                <label className="lb-form">Môn học tiên quyết</label>
                <AsyncSelect  name='subjectParent' 
                value={initSelect} 
                defaultOptions={subSelect} 
                onChange={(item) => {
                    setInitSelect(item);
                  }}
                getOptionLabel={(subSelect)=>subSelect.name} getOptionValue={(subSelect)=>subSelect.subjectId} />
                <br/>
                <button className='btn btn-primary form-control'>Thêm/ cập nhật môn học</button>
            </div>
        </form>
    );
}

export default AdminAddEmployee;