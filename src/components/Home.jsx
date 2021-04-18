import {Fragment, useState, useEffect} from 'react'
import {CSSTransition} from 'react-transition-group'

import myCookie from '../services/cookiesService'

import Sidebar from "./Sidebar"
import Module from "./BasicModule"
import Header from "./Header"

// Posible optimizacion:
// TODO: Agregar contexto que contenga el modulo cargado y el usuario
const Home = ({handleSignOut}) => {
    const [module, setModule] = useState(null);
    const [inProp, setInProp] = useState(false);

    const user = myCookie.user.get();

    if (user === undefined) {
        handleSignOut();
    }

    const handleSelectSidebarModule = (module) => {
        setInProp(false)
        setModule(module);
    }

    useEffect( () => {
        setInProp(true)
    },[module])

    return (
        <Fragment>
            <Header name={user.name}/>
            <div className="container-fluid" >
                <div className="row">
                    <Sidebar 
                        handleClick={ handleSelectSidebarModule }
                        handleSignOut={handleSignOut}/>
                        <CSSTransition in={inProp} timeout={500} classNames="my-node" exit={false}>
                            <Module module={ module }/>
                        </CSSTransition>
                </div>
            </div>
        </Fragment>
    );
}

export default Home