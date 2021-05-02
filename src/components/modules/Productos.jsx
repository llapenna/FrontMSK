import { Fragment, useEffect } from "react"

import { getCommodities } from '../../services/commoditiesService'

import { ModuleTitle, ModuleSection } from "../BasicModule"
import Table from "../table/Table"


const Productos = () => {

    const tableColumns = [
        {
            id: 0,
            key: "InternalCode",
            name: "Código"
        },
        {
            id: 1,
            key: "Name",
            name: "Descripción"
        },
        {
            id: 2,
            key: "UnitOfMeasurement",
            name: "Unidad"
        },
        {
            id: 3,
            key: "Price",
            name: "Precio"
        },
    ]
    const filters = [
        {
            id: 0,
            key: "Name",
            name: "Descripción"
        }
    ]
    const customFilter = [
        {
            id: 1,
            key: "InternalCode",
            name: "Nro. de Producto"
        }
    ]
    

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
                                filterBy={filters}
                                handleGetData={getCommodities}
                                customFilter={customFilter}/> }
                    moduleName={moduleName}>
                </ModuleSection>
            </div>
        </Fragment>
    );
}

export default Productos;