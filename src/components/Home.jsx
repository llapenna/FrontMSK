import {Fragment, useState} from 'react'

import myCookie from '../services/cookiesService'

import Sidebar from "./Sidebar"
import Module from "./BasicModule"
import Header from "./Header"

// Posible optimizacion:
// TODO: Agregar contexto que contenga el modulo cargado y el usuario
const Home = ({handleSignOut}) => {
    const [module, setModule] = useState(null);

    const user = myCookie.user.get();

    const handleSelectSidebarModule = (module) => {
        setModule(module);
    }

    return (
        <Fragment>
            <Header name={user.name}/>
            <div className="container-fluid" >
                <div className="row">
                    <Sidebar 
                        handleClick={ handleSelectSidebarModule }
                        handleSignOut={handleSignOut}/>
                    <Module module={ module }/>
                </div>
            </div>
        </Fragment>
    );
}

export default Home