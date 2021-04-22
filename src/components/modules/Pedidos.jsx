import { Fragment, useState } from "react"
import {CSSTransition} from 'react-transition-group'

import { findAttributeOf, getClients } from '../../services/clientsService'
import { getCommodities } from '../../services/commoditiesService'
import { getOrders, addOrder } from "../../services/ordersService"

import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from "../Awesome"
import Table from "../Table"

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

const clientColumns = [
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

// Nos quedamos con todo menos con el id
const filterClient =[
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

const productosColumns = [
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

const filterCommodities = [
    {
        id: 0,
        key: "InternalCode",
        name: "Código"
    },
    {
        id: 1,
        key: "Name",
        name: "Descripción"
    }
]

const OrderItem = ({item, handleRemoveCommoditie, handleSetCant}) => {
    const [cantidad, setCantidad] = useState(0);

    const handleOnChange = element => {
        setCantidad(element.value);
        handleSetCant(item.id, element.value);
    }
    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div>
                <h6 className="my-0">{item.codigo}-{item.descripcion}</h6>
                
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
                tableColumns={clientColumns}
                handleGetData={getClients}
                handleSelectRow={handleSelectClientRow}
                filterColumns={filterClient}
                customFilter={[{id: filterClient.length + 2, key: "Id_system",name: "Nro de Cliente"}]}/>
        </Fragment>
    );
}

const SelectCommodity = ({handleSetCommodity, commodities}) => {

    const handleSelectCommodity = row => {
        console.log(row)
        // Obtenemos la informacion desde la fila
        // TODO: Optimizar carga de datos
        const commoditie = {
            id: row.attributes["dataid"].value,
            codigo: row.childNodes[1].innerText,
            descripcion: row.childNodes[2].innerText,
            precio: parseFloat(row.childNodes[3].innerText),
            sellCant: 0,
        }
        handleSetCommodity(commoditie);
    }

    return (
        <div className="col-md-7 order-md-1">
            <Table 
                tableColumns={productosColumns}
                filterColumns={filterCommodities}
                customFilter={[{id: filterCommodities.length + 1, key: "InternalCode",name: "Nro. de Producto"}]}
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
                <i className="fas fa-shopping-cart fa-2x py-2 pe-2"></i>
                <h6>{`${client.name} - ${client.cuit}`}</h6>
                {/* <small></small> */}
            </li>

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
                            : "$" + commodities.reduce( (acc, cur) => acc + parseFloat(Math.round((cur.precio * cur.sellCant) * 100) / 100), 0)
                    }</span>
                </li>}
            </ul>
        </div>
    );
}

const SubmitPedido = () => {
    const initial = {
        client: {
            id: null,
            name: null,
            cuit: null,
            phone: null
        },
        commodities: []
    }
    const [client, setClient] = useState(initial.client);
    const [commodities, setCommodities] = useState(initial.commodities);

    const handleSetClient = client => {
        setClient(client);
    }
    const handleSetCommodity = newCommodity => {
        setCommodities([...commodities, newCommodity])
    }

    const handleRemoveCommoditie = id => {
        setCommodities(commodities.filter( p => p.id !== id))
    }
    const handleSetCant = (id, sellCant) => {
        const index = commodities.findIndex( p => p.id == id);

        setCommodities([
            ...commodities.slice(0,index),
            {...commodities[index], sellCant},
            ...commodities.slice(index + 1)
        ])
    }

    // Guarda el pedido en la base de datos
    const handleSubmitPedido = () => {

        // Si encontramos algun item que le falte una cantidad, avisamos
        if (commodities.findIndex( commoditie => commoditie.sellCant === 0) !== -1) {
            alert("No se ha especificado una cantidad para un item");

        // Si no se cargo ningun item
        } else if (commodities.length === 0) {
            alert("No se ha especificado un item para el pedido");
            
        } else {

            const newOrder = {
                IdCustomer: client.id,
                Detail: commodities.map( ({id, sellCant, precio}) => {return {
                    IdCommodity: id,
                    Amount: sellCant,
                    Price: precio
                }})
            }
    
            addOrder(newOrder).then( result => {
                if (result) {
                    alert("Pedido cargado con exito");
    
                    setClient(initial.client);
                    setCommodities(initial.commodities);
                } else {
                    alert("Hubo un error al cargar el pedido, vuelva a intentarlo.")
                }
            });
        }
    }
    const handleCancelPedido = () => {
        setClient(initial.client);
        setCommodities([]);
    }

    // El registro del pedido es secuencial
    // 1: elegir cliente
    // 2: elegir items
    // 3: ???
    // 4: profit!
    
    // TODO: Optimizar esto y extraerlo de alguna forma
    return (
        <CSSTransition in={client.id !== null} timeout={500} classNames="order" exit={false}>
            {
                client.id == null
                ?
                // Selector de clientes
                <div>
                    <SelectClient 
                        handleSetClient={handleSetClient}/>
                </div>

                :
                <div>
                    <h4 className="mb-3">Seleccionar Productos</h4>
        
                    <div className="row">
        
                        {/* Seleccionador */}
                        <SelectCommodity 
                            commodities={commodities}
                            handleSetCommodity={handleSetCommodity}/>
        
                        {/* Carrito */}
                        <Carrito 
                            client={client} 
                            commodities={commodities}
                            handleSubmitPedido={handleSubmitPedido}
                            handleRemoveCommoditie={handleRemoveCommoditie}
                            handleSetCant={handleSetCant}
                            handleCancelPedido={handleCancelPedido}/>
                    </div>
                </div>
            }
        </CSSTransition>
    );
}


const Pedidos = () => {    

    const moduleName = 'Pedidos'

    return (
        <Fragment>
            <ModuleTitle text="Pedidos"/>
            
            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>

                <ModuleSection
                    i={0}
                    sectionName="Nuevo pedido"
                    section= { <SubmitPedido /> }
                    moduleName={moduleName}>
                </ModuleSection>


                <ModuleSection
                    i={1}
                    sectionName="Pendientes por sincronizar"
                    section={ <Table 
                                tableColumns={tableColumns}
                                handleGetData={getOrders}
                                filterColumns={null}/> }
                    moduleName={moduleName}>
                </ModuleSection>
                
                {/* <ModuleSection
                    i={1}
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns} 
                                handleGetData={getOrders}/>}
                        moduleName={"Pedidos"}>
                </ModuleSection> */}
            </div>
        </Fragment>
    );
}

export default Pedidos;