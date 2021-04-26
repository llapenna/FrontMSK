import { Fragment, useState } from "react"
import {CSSTransition} from 'react-transition-group'

import { findAttributeOf, getClients } from '../../services/clientsService'
import { getCommodities } from '../../services/commoditiesService'
import { getOrders, addOrder } from "../../services/ordersService"

import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from "../Awesome"
import Table from "../table/Table"

import { round } from '../../utils/functions'

const tableColumns = [
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
    },
]

const OrderItem = ({item, handleRemoveCommoditie, handleSetCant}) => {
    const [cantidad, setCantidad] = useState(0);

    const handleOnChange = element => {

        // Pregunta si lo ingresado no es un numero
        const sellAmount = isNaN(Number(element.value)) ? 0 : element.value
        
        setCantidad(sellAmount);
        handleSetCant(item.id, sellAmount);
        
    }
    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div>
                <h6 className="my-0">{item.codigo} - {item.descripcion}</h6>
                
                <div 
                    className="input-group input-group-sm mb-3"
                    style={{maxWidth:"10rem !important"}}>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={ () => handleRemoveCommoditie(item.id)}>
                        <AwesomeIcon icon="times"/>
                    </button>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Cantidad..." 
                        aria-label="Cantidad"
                        onChange={e => handleOnChange(e.target)} />
                </div>
            </div>
            <span className="text-muted">Total: ${Math.round((cantidad * item.precio) * 100) / 100}</span>
        </li>
    )
}

const SelectClient = ({handleSetClient}) => {

    const columns = [
        {
            id: 0,
            key: "Id_system",
            name: "#",
            type: "string"
        },
        {
            id: 1,
            key: "Name",
            name: "Razón Social",
            type: "string"
        },
        {
            id: 2,
            key: "Cuit",
            name: "CUIT",
            type: "string"
        },
        {
            id: 3,
            key: "Phone",
            name: "Teléfono",
            type: "string"
        },
        {
            id: 4,
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 5,
            key: "City",
            name: "Localidad",
            type: "string"
        }
    ]
    const filters = [
        {
            id: 0,
            key: "Name",
            name: "Razón Social",
            type: "string"
        },
        {
            id: 1,
            key: "Cuit",
            name: "CUIT",
            type: "string"
        },
        {
            id: 2,
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 3,
            key: "City",
            name: "Localidad",
            type: "string"
        }
    ]
    const customFilter = [
        {id: filters.length, key: "Id_system",name: "Nro de Cliente"}
    ]

    const handleSelectClientRow = row => {
        
        const client = {
            id: row.attributes["dataid"].value,
            name: findAttributeOf(row, "Name"),
            cuit: findAttributeOf(row, "Cuit"),
            phone: findAttributeOf(row,"Phone")
        }
        handleSetClient(client);
    }

    return(
        <Fragment>
            <h4 className="mb-4">Seleccionar Cliente</h4>

            <Table 
                columns={columns}
                filterBy={filters}
                customFilter={customFilter}
                handleGetData={getClients}
                handleSelectRow={handleSelectClientRow}/>
        </Fragment>
    );
}

const SelectCommodity = ({handleSetCommodity, commodities}) => {

    const columns = [
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
            key: "Precio",
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
            name: "Código"
        },
    ]

    const handleSelectCommodity = row => {

        // Obtenemos la informacion desde la fila
        // TODO: Optimizar carga de datos
        const commoditie = {
            id: row.attributes["dataid"].value,
            codigo: findAttributeOf(row, "InternalCode"),
            descripcion: findAttributeOf(row, "Name"),
            precio: findAttributeOf(row, "Precio"),
            sellCant: 0,
        }
        handleSetCommodity(commoditie);
    }

    return (
        <div className="col-md-7 order-md-1">
            <Table 
                columns={columns}
                filterBy={filters}
                customFilter={customFilter}
                handleGetData={getCommodities}
                handleSelectRow={handleSelectCommodity}
                excludeRow={commodities}
                theme="success"/>
        </div>
    );
}

const Carrito = ({client, commodities, handleRemoveCommoditie, handleSetCant, handleSubmitPedido, handleCancelPedido}) => {
    return (
        <div className="col-md-5 order-md-2 mb-4">
            <h4 className="mt-5 mb-3 responsive-h4">Agregados</h4>

            <ul className="list-group">

                {/* Cliente */}
                <li className="list-group-item list-group-item-success" style={{display:"flex"}}>
                    <div 
                        className="row"
                        style={{width:"100%"}}>

                        {/* Nombre y cuit del cliente seleccionado */}
                        <div className="col-11">
                            <h6>{`${client.name} - ${client.cuit}`}</h6>
                        </div>

                        <div className="col-1">
                            <i className="fas fa-shopping-cart fa-2x py-2 pe-2"></i>
                        </div>

                    </div>
                </li>

                {/* Mostramos todos los items seleccionados para comprarse */}
                { commodities.map( (product, i) => 
                    <OrderItem 
                        key={product.id}
                        item={product}
                        handleRemoveCommoditie={handleRemoveCommoditie}
                        handleSetCant={handleSetCant}/>)}

                {/* Total del carrito */}
                { //products.length > 0 && 
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="row">
                        <div className="col-sm-12">
                            <button 
                                className="btn btn-success"
                                onClick={handleSubmitPedido}>
                                Confirmar
                            </button>
                            <button 
                                className="btn btn-danger"
                                onClick={handleCancelPedido}>
                                Cancelar
                            </button>                            
                        </div>
                    </div>
                    
                    <span className="text-muted">Total: { 
                        commodities.length === 0
                            ? "$0"
                            //: "$" + commodities.reduce( (acc, cur) => acc + parseFloat(Math.round((cur.precio * cur.sellCant) * 100) / 100), 0)
                            : "$" + Math.round(commodities.reduce( (acc, cur) => acc + parseFloat(cur.precio * cur.sellCant), 0) * 100) / 100
                    }</span>
                </li>}
            </ul>
        </div>
    );
}


const Pedidos = () => {    

    const moduleName = 'OrderList'

    return (
        <Fragment>

            <ModuleTitle text="Pedidos pendientes"/>

            <Table 
                columns={tableColumns}
                filterBy={null}
                handleGetData={getOrders}/>
        </Fragment>
    );
}

export default Pedidos;