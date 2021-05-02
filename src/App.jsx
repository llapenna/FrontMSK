// Core
import React, {useState, useEffect, createContext} from 'react';

// Services
import myCookies from './services/cookiesService'

// Components
import SignIn from './components/SignIn'
import Home from "./components/Home"

export const AppContext = createContext();


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
             ? 
             <AppContext.Provider value={{
                user: {
                    ...user.user,
                    // client info
                    isClient: false,
                    client: {
                        id: -1,
                        name: ''
                    },
                    signOut: handleSignOut,
                }
             }}>
                
                <Home handleSignOut={handleSignOut} />

             </AppContext.Provider>

             : <SignIn handleSignIn={handleSignIn} />
    );
}

export default App