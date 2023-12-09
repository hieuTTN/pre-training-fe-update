import layoutAdmin from '../layout/admin/Layout'
import layoutEmployee from '../layout/employee/LayoutEmployee'
import layoutLogin from '../layout/user/loginlayout/login'

//admin
import homeAdmin from '../pages/admin/home/home'
import userAdmin from '../pages/admin/user/user'
import employeeAdmin from '../pages/admin/employee/employee'
import addEmployeeAdmin from '../pages/admin/employee/addemployee'

//employee
import homeEmployee from '../pages/employee/home/home'
import studentEmployee from '../pages/employee/student/student'
import subjectEmployee from '../pages/employee/subject/subject'
import addSubjectEmployee from '../pages/employee/subject/addSubject'
import addStudentEmployee from '../pages/employee/student/addStudent'
import classEmployee from '../pages/employee/classes/classes'
import addClassEmployee from '../pages/employee/classes/addClass'
import facultyEmployee from '../pages/employee/faculty/faculty'
import teacherEmployee from '../pages/employee/teacher/teacher'
import addTeacherEmployee from '../pages/employee/teacher/addTeacher'
import majorEmployee from '../pages/employee/major/major'

//public
import login from '../pages/public/login/login'
import home from '../pages/public/home/home'

//private
import DefaultLayout from '../layout/user/defaultLayout/defaultLayout'
import curriculum from '../pages/student/curriculum'
import curriculumTeacher from '../pages/teacher/curriculum'
import accountStudent from '../pages/student/account'
import accountTeacher from '../pages/teacher/account'

const publicRoutes = [
    { path: "/", component: home},
    { path: "/login", component: login, layout: layoutLogin }
];

const privateRoutes = [
    { path: "/dao-tao/student", component: curriculum, layout: DefaultLayout},
    { path: "/dao-tao/teacher", component: curriculumTeacher, layout: DefaultLayout},
    { path: "/account-student", component: accountStudent, layout: DefaultLayout},
    { path: "/account-teacher", component: accountTeacher, layout: DefaultLayout},
];

const adminRoutes = [
    { path: "/admin/home", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/employee", component: employeeAdmin, layout: layoutAdmin },
    { path: "/admin/add-employee", component: addEmployeeAdmin, layout: layoutAdmin },
];

const employeeRoutes = [
    { path: "/employee/home", component: homeEmployee, layout: layoutEmployee },
    { path: "/employee/student", component: studentEmployee, layout: layoutEmployee },
    { path: "/employee/subject", component: subjectEmployee, layout: layoutEmployee },
    { path: "/employee/add-subject", component: addSubjectEmployee, layout: layoutEmployee },
    { path: "/employee/add-student", component: addStudentEmployee, layout: layoutEmployee },
    { path: "/employee/class", component: classEmployee, layout: layoutEmployee },
    { path: "/employee/add-class", component: addClassEmployee, layout: layoutEmployee },
    { path: "/employee/faculty", component: facultyEmployee, layout: layoutEmployee },
    { path: "/employee/teacher", component: teacherEmployee, layout: layoutEmployee },
    { path: "/employee/add-teacher", component: addTeacherEmployee, layout: layoutEmployee },
    { path: "/employee/major", component: majorEmployee, layout: layoutEmployee },
];

export { publicRoutes, privateRoutes, adminRoutes, employeeRoutes};
