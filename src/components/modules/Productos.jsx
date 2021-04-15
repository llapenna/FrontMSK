import { Fragment, useEffect } from "react"

import { getCommodities } from '../../services/commoditiesService'

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../Table"


const tableColumns = [
    {
        id: 0,
        key: "InternalCode",
        name: "Codigo"
    },
    {
        id: 1,
        key: "Name",
        name: "Descripcion"
    },
    {
        id: 2,
        key: "Line",
        name: "Linea"
    },
    {
        id: 3,
        key: "Heading",
        name: "Rubro"
    },
    {
        id: 4,
        key: "Stock",
        name: "Stock"
    },
    {
        id: 5,
        key: "Precio",
        name: "Precio"
    },
]

const Productos = () => {

    const moduleName = "Productos"

    return (
        <Fragment>
            <ModuleTitle text="Productos" />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>
                <ModuleSection
                    i={0}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                handleGetData={getCommodities}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Productos;