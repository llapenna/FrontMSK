import { Fragment, useState, useEffect } from "react"
import { getRoles } from "../../services/rolesService"

import userService from '../../services/usersService'

import { AwesomeIcon } from "../Awesome"
import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../table/Table"

const tableColumns = [
    {
        id: 0,
        key: "User",
        name: "Usuario"
    },
    {
        id: 1,
        key: "Mail",
        name: "E-Mail"
    },
    {
        id: 2,
        key: "Phone",
        name: "Teléfono"
    }
]



const SubmitUsuario = () => {
    const initial = {
        role: {
            id: -1,
            name: "Tipo de Usuario"
        }
    }
    const [wrongInfo, setWrongInfo] = useState(false);
    const [fetchedRoles, setFetchedRoles] = useState([]);
    const [role, setRole] = useState(initial.role)

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSelectRole = ({id, name}) => {
        setRole({
            id: Number(id),
            name
        });
    }

    const handleCloseError = () => {
        setWrongInfo(false);
    }

    const handleSubmitUser = e => {
        e.preventDefault();

        const pass = document.getElementById("inputPassword").value;
        const confirmPassword = document.getElementById("inputConfirmPassword").value;
        const user = document.getElementById("inputUsername").value;
        const mail = document.getElementById("inputEmail").value;
        const phone = document.getElementById("inputPhone").value;

        document.getElementById('inputSeller')
        document.getElementById('inputCustomer')

        const sellerid = role.name === 'Vendedor' ? document.getElementById("inputSeller").value : 0;
        const customerid = role.name === 'Cliente' ? document.getElementById("inputCustomer").value :0;

        // Chequea por un campo vacio
        if (!pass || !confirmPassword || !user || !mail || !phone || role.id === -1) {
            setWrongInfo({state: true, error: "No todos los campos fueron llenados"})
        }
        // Chequea por que las contraseñas sean iguales
        else if (pass !== confirmPassword) {
            setWrongInfo({state: true, error: "Las contraseñas no coinciden"});
        }
        else if ((role.name === 'Vendedor' && !sellerid) ||
                (role.name === 'Cliente' && !customerid)) {
            setWrongInfo({state: true, error: "No todos los campos fueron llenados"})
        }
        else {
            userService.add({
                user,
                roles: [role],
                mail,
                pass,
                phone,
                name: user,
                sellerid,
                customerid,
            })
            .then(result => 
                result ? alert("Usuario agregado con exito.") : alert("Hubo un error, vuelva a intentarlo más tarde.")
            )
        }     
    }

    // Buscar los tipos/roles de usuario y plasmarlos en el dropdown
    useEffect( () => {
        getRoles().then(roles => setFetchedRoles(roles));
    }, [])

    return (
        <form onSubmit={e => handleSubmitUser(e) }>

            {/* TODO: Mover el numero de vendedor/cliente una linea abajo porque no se ve */}
            <label className="form-label my-4">Información Básica</label>
            <div className="row">
                
                <div className="col-md-4 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-edit"/></span>
                        <input type="text" aria-label="Usuario" className="form-control" placeholder="Usuario"
                            id="inputUsername"/>

                        <button 
                            className="btn btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">{role.name}</button>
                        <ul className="dropdown-menu">
                            {
                                fetchedRoles.map( r => 
                                    <li 
                                        key={r.id}
                                        roleid={r.id}
                                        className="dropdown-item"
                                        onClick={e => handleSelectRole(r)}
                                        style={{cursor:"pointer"}}>
                                        {r.name}
                                    </li>)
                            }
                        </ul> 
                    </div>
                </div>
            </div>

            { role.name === 'Vendedor' && 
            <div classname='row'>
                <div className='col-md-4 order-2'>
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="tag"/></span>
                        <input type="text" aria-label="Numero de Vendedor" className="form-control" placeholder="Número de Vendedor"
                            id="inputSeller"/>
                    </div>
                </div>
            </div> }
            { role.name === 'Cliente' &&
            <div className='row'>
                <div className='col-md-4 order-2'>
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="tag"/></span>
                        <input type="text" aria-label="Numero de Cliente" className="form-control" placeholder="Número de Cliente"
                            id="inputCustomer"/>
                    </div>
                </div> 
            </div>}

            <div className="row">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">

                        <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Teléfono"
                            id="inputPhone"/>

                        <span className="input-group-text"><AwesomeIcon icon="envelope"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Correo Electrónico"
                            id="inputEmail"/>
                    </div>
                </div>
            </div>

            <label className="form-label my-4">Contraseña</label>

            <div className="row row-cols-1">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input
                            type={showPassword ? "text" : "password"} 
                            aria-label="Razon Social" 
                            className="form-control" 
                            placeholder="Contraseña"
                            id="inputPassword"/>
                        <button 
                            tabIndex="-1"
                            className="btn btn-outline-secondary" 
                            type="button" 
                            onClick={handleClickShowPassword}>
                            <AwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="row row-cols-1">
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            aria-label="Razon Social" 
                            className="form-control" 
                            placeholder="Confirmar Contraseña"
                            id="inputConfirmPassword"/>
                        <button 
                            tabIndex="-1"
                            className="btn btn-outline-secondary" 
                            type="button" 
                            onClick={handleClickShowConfirmPassword}>
                            <AwesomeIcon icon={showConfirmPassword ? "eye-slash" : "eye"} />
                        </button>
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
                    sectionName="Listado de Usuarios"
                    section={ <Table 
                                columns={tableColumns}
                                handleGetData={userService.get}
                                filterBy={null}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Usuarios;