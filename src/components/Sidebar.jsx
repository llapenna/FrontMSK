import { Fragment, useState, useEffect } from 'react';
import { AwesomeSidebar, AwesomeSpinner } from "./Awesome";

import {getModules} from '../services/modulesService'
import myCookies from '../services/cookiesService'

import Pedidos from "./modules/Pedidos"
import Clientes from "./modules/Clientes"
import Productos from "./modules/Productos"
import Usuarios from "./modules/Usuarios"

const idToModule = id => {
    switch (id) {
        case 1:
            return <Productos /> ;
        case 2: 
            return <Pedidos /> ;
        case 3:
            return <Clientes /> ;
        case 5:
            return <Usuarios /> ;
        default:
            return null;
    }
}

const SidebarTitle = ({ text }) => {
    return (
        <h6 
            className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span> { text }</span>
        </h6>
    )
}

const SidebarItem = ({ icon, text, selected, module, handleClick}) => {

    const isToggler = window.innerWidth < 768 
        ? {
            toggle:"collapse",
            target:"#sidebarMenu"
        }
        : {}

    return (
        <li 
            className="nav-item hover-selection sidebar-item"
            data-bs-toggle={isToggler.toggle}
            data-bs-target={isToggler.target}
            style={{color: selected ? "var(--bs-primary)" : "inherit"}}
            onClick={() => handleClick(module)}>
            <AwesomeSidebar icon={icon} text={text}/>
        </li>
    );
}

const SidebarList = ({ title, modules, handleClick }) => {

    return (
        <Fragment>
            <SidebarTitle text={title} />
            <ul className="nav flex-column">
                { modules.map( ({Icon, Id, Name}, i) => 
                    <SidebarItem 
                        key={i} 
                        text={Name} 
                        icon={Icon} 
                        handleClick = {handleClick}
                        module={ idToModule(Id) } /> 
                )}
            </ul>
        </Fragment>
    )
}

const Sidebar = ({handleClick, handleSignOut}) => {
    const [moduleList, setModuleList] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect( () => {

        setLoadingData(true);

        // Obtiene los modulos que el usuario tiene permitido usar
        const user = myCookies.user.get();
        getModules(user).then(modules => {
            setModuleList(modules);
            setLoadingData(false);
        });
    }, [])

    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky">

            {loadingData && <AwesomeSpinner size={"3x"}/>}
            
            {
                moduleList.map(({keyName, [keyName]:modules}, i) => 
                    <SidebarList 
                        key={i}
                        title={keyName}
                        modules={modules}
                        handleClick={handleClick}/>)
            }

            <SidebarItem
                text="Cerrar Sesión" 
                icon="sign-out-alt"
                handleClick = {handleSignOut}
                module={ null }  />
            </div>
        </nav>
    );
}

export default Sidebar;