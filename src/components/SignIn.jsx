import { useState } from "react"

import {login} from "../services/usersService"

import { AwesomeSpinner, AwesomeIcon } from './Awesome'


const SignIn = ({handleSignIn}) => {
    const [wrongCred, setWrongCred] = useState({status: false});
    const [loadingData, setLoadingData] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleOnClick = e => {
        e.preventDefault();

        setLoadingData(true);

        const user = document.getElementById("inputUser").value;
        const pass = document.getElementById("inputPassword").value;

        login({user,pass}).then(data => {

            if (data.signedIn) {
                // Guardamos la informacion satisfactoria en cookies
                //myCookies.user.set(data.user)

                handleSignIn(data);
            } else {
                setWrongCred({status: true, error: data.error});
                setLoadingData(false);
            }
        })
    }

    const handleCloseError = () => {
        setWrongCred({status: false});
    }
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div 
            className="text-center py-5">
            <form className="form-signin">
                <img 
                    className="mb-4" 
                    src="favicon.ico"
                    style={{width:"72px", height:"72px"}}
                    alt="MSK Logo"/>
                <h1 className="h3 mb-3 font-weight-normal">Iniciar Sesión</h1>
                
                <label className="sr-only" htmlFor="inputEmail">Usuario</label>
                <input id="inputUser" className="form-control" type="text" placeholder="Nombre de Usuario" required="" autoFocus=""/>
                <br/>

                {/* <label className="sr-only" htmlFor="inputPassword">Contraseña</label>
                <input id="inputPassword" className="form-control" type="password" placeholder="Contraseña" required=""/> */}

                <label className="sr-only" htmlFor="inputPassword">Contraseña</label>
                <div className="input-group mb-3">
                    <input 
                        id="inputPassword" 
                        className="form-control" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Contraseña" 
                        required=""/>
                    <button 
                        className="btn btn-outline-secondary" 
                        type="button" 
                        onClick={handleClickShowPassword}>
                        <AwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                    </button>
                </div>


                <div className="form-check my-3 d-flex justify-content-center" style={{display:"none"}}>
                    {/* <input className="form-check-input me-2" type="checkbox" value="" />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Recordarme
                    </label> */}
                </div>

                { loadingData && <div className="mb-3"><AwesomeSpinner icon="spinner"/></div> }
                { wrongCred.status &&
                    <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        {wrongCred.error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="alert" 
                        aria-label="Close"
                        onClick={handleCloseError}>    
                    </button>
                  </div>}
                <button 
                    className="btn btn-lg btn-success btn-block" 
                    type="submit"
                    disabled={loadingData}
                    onClick={ (e) => handleOnClick(e) }>
                    Login
                </button>
                <p className="mt-5 mb-3 text-muted">Developed by  MSK Sistemas © 2020-2021</p>
            </form>
        </div>
    )
}

export default SignIn