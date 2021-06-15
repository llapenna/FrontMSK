import {Fragment, useState, useEffect, createContext} from 'react'
import {CSSTransition} from 'react-transition-group'

import myCookie from '../services/cookiesService'

import Sidebar from "./Sidebar"
import Module from "./BasicModule"
import Header from "./Header"

export const HomeContext = createContext();

// Posible optimizacion:
// TODO: Agregar contexto que contenga el modulo cargado y el usuario
const Home = ({handleSignOut}) => {
    const [module, setModule] = useState({id: -1, component: null});
    const [inProp, setInProp] = useState(false);

    const voidFunc = () => {
        console.error('Restart not implemented')
    }

    // Stores into the state an anonymous function
    const [restartFunction, setRestartFunction] = useState(() => voidFunc);

    const user = myCookie.user.get();

    if (user === undefined) {
        handleSignOut();
    }

    const handleSelectSidebarModule = (newModule, moduleid) => {
        setInProp(false)
        setModule({id: moduleid, component: newModule});
    }

    useEffect( () => {
        setInProp(true)
    },[module.id])

    return (
        <Fragment>
            <HomeContext.Provider
                value={{
                    module,
                    restartFunction,
                    setRestartFunction
                }}>

                <Header name={user.name}/>

                <div className="container-fluid" >
                    <div className="row">

                        <Sidebar 
                            handleClick={handleSelectSidebarModule}
                            handleSignOut={handleSignOut}/>

                        <CSSTransition in={inProp} timeout={500} classNames="home" exit={false}>
                            <Module module={ module.component }/>
                        </CSSTransition>

                    </div>
                </div>
            </HomeContext.Provider>

        </Fragment>
    );
}

export default Home