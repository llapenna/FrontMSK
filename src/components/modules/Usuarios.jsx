import { Fragment } from "react"

import {  } from '../../services/usersService'

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


const Usuarios = () => {

    const moduleName = 'Usuarios'

    return (
        <Fragment>
            <ModuleTitle text={moduleName} />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>
                <ModuleSection
                    i={0}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                pagination={true}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}