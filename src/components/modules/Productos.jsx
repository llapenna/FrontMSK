import { Fragment, useEffect } from "react"

import { getCommodities } from '../../services/commoditiesService'

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../table/Table"


const tableColumns = [
    {
        id: 1,
        key: "InternalCode",
        name: "Código"
    },
    {
        id: 2,
        key: "Name",
        name: "Descripción"
    },
    // {
    //     id: 3,
    //     key: "Heading",
    //     name: "Rubro"
    // },
    // {
    //     id: 4,
    //     key: "Stock",
    //     name: "Stock"
    // },
    // {
    //     id: 5,
    //     key: "Precio",
    //     name: "Precio"
    // },
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
                                columns={tableColumns}
                                handleGetData={getCommodities}
                                customFilter={[{id: 3, key: "InternalCode",name: "Nro. de Producto"}]}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>

        </Fragment>
    );
}

export default Productos;