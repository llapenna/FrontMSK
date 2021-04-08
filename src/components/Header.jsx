const Header = ({name}) => {
	
    return (
        <nav className="navbar navbar-dark bg-green sticky-top flex-md-nowrap p-0 shadow">
            <a 
                className="navbar-brand col-md-3 col-lg-2 me-0 px-3 py-2" 
                style={{ cursor:"default", backgroundColor:"var(--bs-green)"}}>{name}</a>
            <button 
                className="navbar-toggler position-absolute d-md-none collapsed" 
                style={{top:".25rem", right:"1rem"}}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <script src="~/src/js/scriptNavBar.js"/>
        </nav>
        
    );
}

export default Header;