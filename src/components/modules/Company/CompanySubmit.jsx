// Core
import {Fragment} from 'react'

// Components
import { ModuleTitle } from "../../BasicModule"
import { AwesomeIcon } from '../../Awesome'
import InputGroup from '../../bootstrap/InputGroup'

// Services
import company from '../../../services/companiesService'

const CompanyForm = () => {

    const handleSubmit = e => {
        e.preventDefault()

        // Obtenemos los valores para la nueva empresa
        const name = document.getElementById("inputName").value;
        const cuit = document.getElementById("inputCuit").value;

        // Obtenemos valores para el usuario admin
        const pass = document.getElementById("inputPassword").value;
        const confirmPassword = document.getElementById("inputPasswordConfirmation").value;
        const user = document.getElementById("inputUsername").value;
        const email = document.getElementById("inputEmail").value;
        const phone = document.getElementById("inputPhone").value;
        
        // Chequea por un campo vacio
        if (!name || !cuit || !pass || !confirmPassword || !user || !email || !phone)
            alert('No todos los campos fueron llenados')
        else if (pass !== confirmPassword)
            alert('Las contraseñas no coinciden')
        else {

            // Carga la empresa en la base de datos
            const result = company.add({
                name,
                cuit,
                user,
                pass,
                email,
                phone,
            })

            alert(result 
                ? 'Empresa cargada con éxito.'
                : result.error)
        } 
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>

            <label className='form-label my-4'>Empresa</label>
            <div className='row'>

                <div className="col-md-6 order-md-1">
                    <div className='input-group mb-3'>
                        
                        <span className="input-group-text"><AwesomeIcon icon="user-edit"/></span>
                        <input type="text" aria-label="Name" className="form-control" placeholder="Nombre"
                            id="inputName"/>

                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Cuit" className="form-control" placeholder="CUIT"
                            id="inputCuit"/>
                    </div>
                </div>
            </div>

            <label className='form-label my-4'>Usuario Admin</label>
            <div className='row'>
                <div className='col-md-6 order-md-1'>
                    <div className='input-group mb-3'>
                        <span className="input-group-text"><AwesomeIcon icon="user-tie"/></span>
                        <input type="text" aria-label="Usuario" className="form-control" placeholder="Usuario"
                            id="inputUsername"/>
                        <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                        <input type="text" aria-label="Phone" className="form-control" placeholder="Teléfono"
                            id="inputPhone"/>
                    </div>
                </div>
            </div>
            <div className='row mb-4'>
                <div className='col-md-6 order-md-1'>
                    <div className='input-group mb-3'>
                        <span className="input-group-text"><AwesomeIcon icon="envelope"/></span>
                        <input type="text" aria-label="Email" className="form-control" placeholder="E-Mail"
                            id="inputEmail"/>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-md-6 order-md-1'>
                    <div className='input-group mb-3'>
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input type="text" aria-label="Password" className="form-control" placeholder="Contraseña"
                            id="inputPassword"/>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-6 order-md-1'>
                    <div className='input-group mb-3'>
                        <span className="input-group-text"><AwesomeIcon icon="lock"/></span>
                        <input type="text" aria-label="PasswordConfirmation" className="form-control" placeholder="Confirmar Contraseña"
                            id="inputPasswordConfirmation"/>
                    </div>
                </div>
            </div>

            <button className="btn btn-success mt-4"><AwesomeIcon icon='check' /></button>
        </form>
    )
}

const CompanySubmit = () => {

    return (
        <Fragment>

            <ModuleTitle text="Crear Empresa"/>
            <CompanyForm />
                
        </Fragment>
    )
}

export default CompanySubmit