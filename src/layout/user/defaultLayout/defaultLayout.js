import Headers from "../header/header";
import Footer from "../footer/footer"
import styleDefaul from './default.scss'

function DefaultLayout({children}){
    return (
        <div>
            <Headers/>
            {children}
            <Footer/>
        </div>
    );
}

export default DefaultLayout;