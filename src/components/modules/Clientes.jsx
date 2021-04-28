import { Fragment, useState } from "react"

import client, { addClient } from '../../services/clientsService'
import { AwesomeIcon } from "../Awesome"

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../table/Table"


const SubmitCliente = () => {
    const [wrongInfo, setWrongInfo] = useState(false);

    const handleCloseError = () => {
        setWrongInfo(false);
    }

    const handleSubmitClient = e => {
        e.preventDefault();

        // Obtenemos valores
        const name = document.getElementById("inputName").value;
        const cuit = document.getElementById("inputCuit").value;

        const phone = document.getElementById("inputPhone").value;
        const address = document.getElementById("inputAddress").value;
        const city = document.getElementById("inputCity").value;

        const seller = document.getElementById("inputSeller").value;
        
        // Chequea por un campo vacio
        if (!name || !cuit || !phone || !address || !city || !seller) {
            setWrongInfo({state: true, error: "No todos los campos fueron llenados"})
        }
        else {
            // Carga el cliente en la base de datos
            client.add({
                name,
                cuit,
                phone,
                address,
                city,
                //seller
            })
            .then(result => 
                result ? alert("Cliente agregado con exito.") : alert("Hubo un error, vuelva a intentarlo más tarde.")
            ) 
        } 
    }

    return (
        <form onSubmit={e => handleSubmitClient(e) }>
            
            <label className="form-label my-4">Información Básica</label>
            <div className="row">
                
                <div className="col-md-6 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-tie"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Razón Social"
                            id="inputName"/>

                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="CUIT"
                            id="inputCuit"/>
                    </div>

                </div>
                {/* <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-cog"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Tipo de Cliente"
                            id="inputCustomerType"/>

                        <span className="input-group-text"><AwesomeIcon icon="tag"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Actividad"
                            id="inputActivity"/>
                    </div>
                </div> */}
            </div>

            <label className="form-label my-4">Información de Contacto</label>

            <div className="row">
                <div className="col-md-2">
                    <div className="input-group mb-3">
                            <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                            <input type="text" aria-label="Razon Social" className="form-control" placeholder="Teléfono"
                            id="inputPhone"/>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="warehouse"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Direccion"
                            id="inputAddress"/>

                        <span className="input-group-text"><AwesomeIcon icon="city"/></span>
                        <input type="text" aria-label="Razon Social" className="form-control" placeholder="Localidad"
                            id="inputCity"/>
                    </div>
                </div>
            </div>

            <label className="form-label my-4">Información Comercial</label>

            <div className="row">
                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-friends"/></span>
                        <input type="text" aria-label="Vendedor" className="form-control" placeholder="Vendedor"
                            id="inputSeller"/>
                    </div>
                </div>
            </div>


            {/* <div className="row">
                
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
            </div> */}

            <button 
                className="btn btn-success mt-4">Agregar cliente</button>
        </form>
    );
}

const Clientes = () => {

    const tableColumns = [
        {
            id: 0,
            key: "Id_system",
            name: "#",
            type: "string"
        },
        {
            id: 1,
            key: "Name",
            name: "Razón Social",
            type: "string"
        },
        {
            id: 2,
            key: "Phone",
            name: "Teléfono",
            type: "string"
        },
        {
            id: 3,
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 4,
            key: "City",
            name: "Localidad",
            type: "string"
        },
        {
            id: 5,
            key: "Balance",
            name: "Saldo",
            type: "number"
        },
        {
            id: 6,
            key: "Seller",
            name: "Vendedor",
            type: "number"
        }
    ]

    const filters = [
        {
            id: 0,
            key: "Name",
            name: "Razón Social",
            type: "string"
        },
        {
            id: 1,
            key: "Phone",
            name: "Teléfono",
            type: "string"
        },
        {
            id: 2,
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 3,
            key: "City",
            name: "Localidad",
            type: "string"
        },,
        {
            id: 4,
            key: "Seller",
            name: "Vendedor",
            type: "number"
        }
    ]

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
                                columns={tableColumns}
                                filterBy={filters}
                                handleGetData={client.get}
                                customFilter={[{id: filters.length, key: "Id_system",name: "Nro de Cliente"}]} />}
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