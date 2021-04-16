import { Fragment, useState } from "react"

import user from '../../services/usersService'

import { AwesomeIcon } from "../Awesome"
import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../Table"

const tableColumns = [
    {
        id: 0,
        key: "Username",
        name: "Usuario"
    },
    {
        id: 1,
        key: "Email",
        name: "E-Mail"
    },
    {
        id: 2,
        key: "Phone",
        name: "Telefono"
    }
]



const SubmitUsuario = () => {
    const [wrongInfo, setWrongInfo] = useState(false);

    const handleCloseError = () => {
        setWrongInfo(false);
    }

    const handleSubmitUser = e => {
        e.preventDefault();

        const password = document.getElementById("inputPassword").value;
        const confirmPassword = document.getElementById("inputConfirmPassword").value;
        const username = document.getElementById("inputUsername").value;
        const email = document.getElementById("inputEmail").value;
        const phone = document.getElementById("inputPhone").value;

        
        // Chequea por un campo vacio
        if (!password || !confirmPassword || !username || !email || !phone) {
            setWrongInfo({state: true, error: "No todos los campos fueron llenados"})
        }
        // Chequea por que las contraseñas sean iguales
        else if (password !== confirmPassword) {
            setWrongInfo({state: true, error: "Las contraseñas no coinciden"});
        }
        else {
            user.add({
                username,
                email,
                password,
                phone
            })
        }     
    }


    return (
        <form onSubmit={e => handleSubmitUser(e) }>

            <label className="form-label my-4">Informacion Basica</label>
            <div className="row">
                
                <div className="col-md-6 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-edit"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Usuario"
                            id="inputUsername"/>

                        <span className="input-group-text"><AwesomeIcon icon="envelope"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Correo Electronico"
                            id="inputEmail"/>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Telefono"
                            id="inputPhone"/>
                    </div>
                </div>
            </div>

            <label className="form-label my-4">Contraseña</label>

            <div className="row row-cols-1">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Contraseña"
                            id="inputPassword"/>
                    </div>
                </div>
            </div>

            <div className="row row-cols-1">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Confirmar Contraseña"
                            id="inputConfirmPassword"/>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 order-md-1">
                { wrongInfo &&
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {wrongInfo.error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        data-bs-dismiss="alert" 
                        aria-label="Close"
                        onClick={handleCloseError}>    
                    </button>
                  </div>}
                </div>
            </div>

            <button className="btn btn-success mt-4">Crear Usuario</button>
        </form>
    );
}

const Usuarios = () => {

    const moduleName = 'Usuarios'

    return (
        <Fragment>
            <ModuleTitle text={moduleName} />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>
                
                <ModuleSection
                    i={0}
                    sectionName="Crear Usuario"
                    section={ <SubmitUsuario /> }
                    moduleName={moduleName}>
                </ModuleSection>

                <ModuleSection
                    i={1}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                handleGetData={user.get}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Usuarios;