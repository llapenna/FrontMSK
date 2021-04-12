import { Fragment, useEffect } from "react"

import { getProducts } from '../../services/productsService'

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../Table"


const tableColumns = [
    {
        id: 0,
        key: "Codigo",
        name: "Codigo"
    },
    {
        id: 1,
        key: "Descripcion",
        name: "Descripcion"
    },
    {
        id: 2,
        key: "Linea",
        name: "Linea"
    },
    {
        id: 3,
        key: "Rubro",
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
                                handleGetData={getProducts}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Productos;