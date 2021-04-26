// Core
import {Fragment} from 'react'

// Components
import { ModuleTitle } from "../../BasicModule"
import Table from "../../table/Table"

// Services
import order from '../../../services/ordersService'


const OrderList = () => {    

    const columns = [
        {
            id: 0,
            key: "CustomerName",
            name: "Razón Social"
        },
        {
            id: 1,
            key: "CustomerCUIT",
            name: "CUIT"
        },
        {
            id: 2,
            key: "Date",
            name: "Fecha"
        }
        // ,
        // {
        //     id: 3,
        //     key: "Seller",
        //     name: "Vendedor",
        //     type: "number"
        // }
    ]

    const moduleName = 'OrderList'

    return (
        <Fragment>

            <ModuleTitle text="Pedidos pendientes"/>

            <Table 
                columns={columns}
                filterBy={null}
                handleGetData={order.get}/>
        </Fragment>
    );
}

export default OrderList;