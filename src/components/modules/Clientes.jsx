import { Fragment } from "react"

import { getClients } from '../../services/clientsService'
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
    return (
        <form>
            
            <label className="form-label">Informacion Basica</label>
            <div className="row">
                
                <div className="col-md-6 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-tie"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Razon Social"/>

                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="CUIT"/>
                    </div>

                </div>
                <div className="col-md-6 order-md-1">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Tipo de Cliente"/>

                        <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Actividad"/>
                    </div>
                </div>
            </div>

            <label className="form-label">Informacion de Contacto</label>

            <div className="row">
                <div className="col-md-4">
                    <div className="input-group mb-3">
                            <span className="input-group-text"><AwesomeIcon icon="phone"/></span>
                            <input type="text" aria-label="Razon Social" class="form-control" placeholder="Telefono"/>
                    </div>
                </div>
            </div>

            <div className="row">
                
                <div className="col-md-8 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="warehouse"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Direccion"/>

                        <span className="input-group-text"><AwesomeIcon icon="city"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Localidad"/>

                        <span className="input-group-text"><AwesomeIcon icon="map" /></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Codigo Postal"/>
                    </div>
                </div>
                <div className="col-md-3 order-md-1">
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="map-signs"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Zona"/>
                    </div>
                </div>
            </div>

            {/* |IVA||||Recorrido|||[ENDLINE] */}

            <label className="form-label">Informacion Comercial</label>

            <div className="row">

                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="user-friends"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Vendedor"/>

                        <span className="input-group-text"><AwesomeIcon icon="building"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Sucursal"/>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="input-group mb-3">
                        <span className="input-group-text"><AwesomeIcon icon="calculator"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="IVA"/>

                        <span className="input-group-text"><AwesomeIcon icon="building"/></span>
                        <input type="text" aria-label="Razon Social" class="form-control" placeholder="Recorrido"/>
                    </div>
                </div>
            </div>


            <button className="btn btn-success">Agregar cliente</button>
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
                                handleGetData={getClients}
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