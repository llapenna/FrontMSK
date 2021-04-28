import React, {useState, useEffect} from 'react';

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

    const handleSignOut = () => {
        // Borramos las cookies previamente cargadas
        myCookies.user.remove();
        setUser(initial);
    }
    const handleSignIn = loggedUser => {
        if (loggedUser.signedIn) {

            // Guardamos la informacion satisfactoria en cookies
            myCookies.user.set({...loggedUser.user})
            //console.log(myCookies.user.get());

            setUser(loggedUser);
        }
    }
    

    // Setea algunas opciones como el titulo y algunos colores
    useEffect( () => {

        const title = user.signedIn ? "Sistema | MSK" : "Iniciar Sesión | MSK"
        document.title = title;

        const bgColor = user.signedIn ? "white" : "#f5f5f5"
        
        const elt = document.getElementsByTagName("body")[0];
        elt.style.backgroundColor = bgColor;
        

    }, [user.signedIn])

    return (
         user.signedIn
             ? <Home handleSignOut={handleSignOut} />
             : <SignIn handleSignIn={handleSignIn} />
    );
}

export default App