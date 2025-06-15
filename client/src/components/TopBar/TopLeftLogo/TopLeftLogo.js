import logo from '../../../images/logo.png';

function TopLeftLogo(){
    return(
        <div className="d-flex align-items-center">
            <button id="toggleSidebarBtn" className="btn btn-outline-secondary">
                <i className="bi bi-list"></i>
            </button>
            <a className="navbar-brand" href="########## the main page path ##########">
                <img src={logo} alt="Logo" className='logo-img' />
            </a>
        </div>
    );
}
export default TopLeftLogo;