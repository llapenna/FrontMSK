import { Fragment } from "react"

import commodity from '../../services/commoditiesService'

import { ModuleTitle } from "../BasicModule"
import Table from "../table/Table"


const Productos = () => {

    const tableColumns = [
        {
            id: 0,
            key: "code",
            name: "Código"
        },
        {
            id: 1,
            key: "name",
            name: "Descripción"
        },
        {
            id: 2,
            key: "unit",
            name: "Unidad"
        },
        {
            id: 3,
            key: "price",
            name: "Precio",
            type: 'number',
        },
    ]
    const filters = [
        {
            id: 0,
            key: "name",
            name: "Descripción"
        }
    ]
    const customFilter = [
        {
            id: 1,
            key: "code",
            name: "Nro. de Producto"
        }
    ]
    

    //const moduleName = "Productos"

    return (
        <Fragment>
            <ModuleTitle text="Productos" />

            <Table 
                columns={tableColumns}
                filterBy={filters}
                handleGetData={commodity.get}
                customFilter={customFilter}/>
        </Fragment>
    );
}

export default Productos;