import { Fragment } from "react"

import client, { addClient } from '../../services/clientsService'
import { AwesomeIcon } from "../Awesome"

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../Table"



const tableColumns = [
    {
        id: 0,
        key: "Name",
        name: "Razon Social"
    },
    {
        id: 1,
        key: "Cuit",
        name: "CUIT"
    },
    {
        id: 2,
        key: "Phone",
        name: "Telefono"
    }/*,
    {
        id: 3,
        key: "direccion",
        name: "Direccion"
    },
    {
        id: 4,
        key: "cp",
        name: "CP"
    },
    {
        id: 5,
        key: "localidad",
        name: "Localidad"
    },
    {
        id: 6,
        key: "sucursal",
        name: "Sucursal"
    },
    {
        id: 7,
        key: "iva",
        name: "IVA"
    },
    {
        id: 8,
        key: "vendedor",
        name: "Vendedor"
    },
    {
        id: 9,
        key: "actividad",
        name: "Actividad"
    },
    {
        id: 10,
        key: "zona",
        name: "Zona"
    },
    {
        id: 11,
        key: "recorrido",
        name: "Recorrido"
    },
    {
        id: 12,
        key: "tipoCliente",
        name: "Tipo de Cliente"
    }*/
]

//Nº|Razón social|Dirección|CP|Localidad|IVA|CUIT|Teléfono|Vendedor|Zona|Recorrido|Tipo de Cliente|Actividad|Sucursal[ENDLINE]



const SubmitCliente = () => {

    const handleSubmitClient = e => {
        e.preventDefault();

        // Obtenemos valores
        // TODO: optimizar
        const newClient = {
            name: document.getElementById("inputName").value,
            cuit: document.getElementById("inputCuit").value,
            customerType: document.getElementById("inputCustomerType").value,
            activity: document.getElementById("inputActivity").value,
            phone: document.getElementById("inputPhone").value,
            address: document.getElementById("inputAddress").value,
            city: document.getElementById("inputCity").value,
            zipcode: document.getElementById("inputZipcode").value,
            zone: document.getElementById("inputZone").value,
            seller: document.getElementById("inputSeller").value,
            branch: document.getElementById("inputBranch").value,
            iva: document.getElementById("inputIva").value,
            route: document.getElementById("inputRoute").value,
        }

        // Carga el cliente en la base de datos
        client.add(newClient)
    }

    return (
        <form onSubmit={e => handleSubmitClient(e) }>
            
            <label className="form-label my-4">Informacion Basica</label>
            <div className="row">
                
                <div className="col-md-6 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-tie"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Razon Social"
                            id="inputName"/>

                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="CUIT"
                            id="inputCuit"/>
                    </div>

                </div>
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-cog"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Tipo de Cliente"
                            id="inputCustomerType"/>

                        <span className="input-group-text"><AwesomeIcon icon="tag"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Actividad"
                            id="inputActivity"/>
                    </div>
                </div>
            </div>

            <label className="form-label my-4">Informacion de Contacto</label>

            <div className="row">
                <div className="col-md-4">
                    <div className="input-group mb-3">
                            <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                            <input type="text" aria-label="Razon Social" className="form-control" placeholder="Telefono"
                            id="inputPhone"/>
                    </div>
                </div>
            </div>

            <div className="row">
                
                <div className="col-md-8 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="warehouse"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Direccion"
                            id="inputAddress"/>

                        <span className="input-group-text"><AwesomeIcon icon="city"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Localidad"
                            id="inputCity"/>

                        <span className="input-group-text"><AwesomeIcon icon="map" /></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="CP"
                            id="inputZipcode"/>
                    </div>
                </div>
                <div className="col-md-3 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="map-signs"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Zona"
                            id="inputZone"/>
                    </div>
                </div>
            </div>

            <label className="form-label my-4">Informacion Comercial</label>

            <div className="row">

                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-friends"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Vendedor"
                            id="inputSeller"/>

                        <span className="input-group-text"><AwesomeIcon icon="building"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Sucursal"
                            id="inputBranch"/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="calculator"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="IVA"
                            id="inputIva"/>

                        <span className="input-group-text"><AwesomeIcon icon="road"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Recorrido"
                            id="inputRoute"/>
                    </div>
                </div>
            </div>

            <button 
                className="btn btn-success mt-4">Agregar cliente</button>
        </form>
    );
}

const Clientes = () => {

    const moduleName = 'Clientes'

    return (
        <Fragment>
            <ModuleTitle text={moduleName} />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>

                <ModuleSection
                    i={0}
                    sectionName="Agregar Cliente"
                    section={ <SubmitCliente /> }
                    moduleName={moduleName}>
                </ModuleSection>

                <ModuleSection
                    i={1}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                handleGetData={client.get}
                                pagination={true}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}


// La data debe recibirse como: 

// [
//     {
//         id: 0,
//         razonSocial: "",
//         cuit: "",
//         ...
//     },
//     {
//         id: 1,
//         razonSocial: "",
//         cuit: "",
//         ...
//     },
//     {
//         id: 2,
//         razonSocial: "",
//         cuit: "",
//         ...
//     },
//     {
//         id: 3,
//         razonSocial: "",
//         cuit: "",
//         ...
//     }
// ]

export default Clientes;