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
            <label className="form-label">Razon Social</label>
            <div className="input-group mb-3">
                <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
            </div>

            <label className="form-label">Informacion de contacto</label>
            <div className="input-group mb-3">
                <span className="input-group-text">Direccion</span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
                <span className="input-group-text">Localidad</span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text">Codigo Postal</span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Telefono</span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
            </div>

            <div className="input-group mb-3">
                <span className="input-group-text"><AwesomeIcon icon="address-card"/></span>
                <input type="text" aria-label="Razon Social" class="form-control" placeholder="..."/>
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