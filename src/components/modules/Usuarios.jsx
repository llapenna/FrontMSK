import { Fragment, useEffect } from "react"

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
        key: "Address",
        name: "Direccion"
    },
    {
        id: 2,
        key: "Zipcode",
        name: "CP"
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


const SubmitData = () => {
    return (
        ""
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
                    section={ <SubmitData /> }
                    moduleName={moduleName}>
                </ModuleSection>

                <ModuleSection
                    i={1}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                pagination={false}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Usuarios;