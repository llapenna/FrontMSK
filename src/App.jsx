import React, {useState, Fragment, useEffect} from 'react';

import myCookies from './services/cookiesService'

import SignIn from './components/SignIn'
import Home from "./components/Home"


const App = () => {
    const initial = {
        signedIn: false,
        user: {
            idUser: null,
            token: null,
            name: null
        }
    }
    const [user, setUser] = useState(initial);

    // Significa que ya estamos logueados
    if (myCookies.user.get() != null && user.signedIn === false) {
        setUser({user: myCookies.user.get(), signedIn: true});
    }

    const handleSignIn = (loggedUser) => {
        if (loggedUser.signedIn) {
            //myCookies.user.set({user: loggedUser.user, handleSignOut: handleSignOut})
            setUser(loggedUser);
        }
    }
    const handleSignOut = () => {
        // Borramos las cookies previamente cargadas
        myCookies.user.remove();
        setUser(initial);
    }

    // Setea algunas opciones como el titulo y algunos colores
    useEffect( () => {
        if (!user.signedIn) {
            document.title = "Iniciar Sesión | MSK";
            const elt = document.getElementsByTagName("body")[0];
            elt.style.backgroundColor="#f5f5f5";
        }
        else {
            document.title = "Sistema | MSK";
        }

        

    }, [user.signedIn])

    return (
         user.signedIn
             ? <Home handleSignOut={handleSignOut} />
             : <SignIn handleSignIn={handleSignIn} />
    );
}

export default App