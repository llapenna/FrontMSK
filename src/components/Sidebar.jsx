import { Fragment, useState, useEffect } from 'react';
import { AwesomeSidebar } from "./Awesome";

import {getModules} from '../services/modulesService'
import myCookies from '../services/cookiesService'

import Pedidos from "./modules/Pedidos"
import Sincronizacion from "./modules/Sincronizacion"
import Clientes from "./modules/Clientes"
import Productos from "./modules/Productos"

const idToModule = id => {
    switch (id) {
        case 1:
            return <Productos /> ;
        case 2: 
            return <Pedidos /> ;
        case 3:
            return <Clientes /> ;
        // case 5:
        //     return <Usuarios /> ;
        default:
            return null;
    }
}

const comercialModules = [
    {
        text: "Pedidos",
        icon: "shopping-cart",
        module: <Pedidos/>
    },
    {
        text: "Clientes",
        icon: "user-friends",
        module: <Clientes />
    }
]

const inventarioModules = [
    {
        text: "Productos",
        icon: "cubes",
        module: null
    }
]

const administracionModules = [
    {
        text: "Sincronizacion",
        icon: "sync-alt",
        module: <Sincronizacion />
    },
    {
        text: "Registrar",
        icon: "user-plus",
        module: null
    },
    {
        text: "Cerrar Sesión",
        icon: "sign-out-alt",
        module: null
    }
]

const SidebarTitle = ({ text }) => {
    return (
        <h6 
            className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span> { text }</span>
        </h6>
    )
}

const SidebarItem = ({ icon, text, selected, module, handleClick}) => {
    return (
        <li 
            className="nav-item hover-selection sidebar-item"
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

    useEffect( () => {
        // Obtiene los modulos que el usuario tiene permitido usar
        const user = myCookies.user.get();
        getModules(user).then(modules => setModuleList(modules));
    }, [])

    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="sidebar-sticky">
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