// Core
import { Fragment, useState, useEffect } from 'react';

// Services
import {getModules} from '../services/modulesService'
import myCookies from '../services/cookiesService'

// Components
import { AwesomeSidebar, AwesomeSpinner } from "./Awesome";
import { HomeContext } from './Home'

// Modules
import Clientes from "./modules/Clientes"
import Productos from "./modules/Productos"
import Usuarios from "./modules/Usuarios"
import OrderList from './modules/Order/OrderList'
import OrderSubmit from './modules/Order/OrderSubmit'

const idToModule = id => {
    switch (id) {
        case 1:
            return <Productos />;
        case 2:
            return <OrderSubmit />;
        case 10:
            return <OrderList />;
        case 3:
            return <Clientes /> ;
        case 4:
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

const SidebarItem = ({ icon, text, selected, module, moduleid, handleClick}) => {

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
            style={{color: selected ? "var(--bs-success)" : "inherit"}}
            onClick={() => handleClick(module, moduleid)}>
            <AwesomeSidebar icon={icon} text={text}/>
        </li>
    );
}

const SidebarList = ({ title, modules, handleClick }) => {

    return (
        <Fragment>
            <SidebarTitle text={title} />

            <HomeContext.Consumer>
                { state => 

                <ul className="nav flex-column">
                    { modules.map( ({Icon, Id, Name}, i) =>{

                        return (
                        <SidebarItem 
                            key={i} 
                            text={Name} 
                            icon={Icon}
                            moduleid={Id}
                            selected={state.module.id === Id}
                            handleClick = {
                                // Si el modulo actualmente seleccionado se presiona nuevamente
                                // lo renderizamos desde cero
                                state.module.id === Id 
                                //? () => console.log("Must restart")
                                ? state.restartFunction
                                : handleClick }
                            module={ idToModule(Id) } />);}
                        
                    )}
                </ul>
                }           
            </HomeContext.Consumer>
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

                <div className="sidebar-logo">
                    <img 
                        src="./favicon.ico"
                        alt="MSK Logo"/>
                    <p>
                        Developed by  MSK Sistemas 
                        <br/> 
                        © 2020-2021
                    </p>
                </div>
            </div>
        </nav>
    );
}

export default Sidebar;