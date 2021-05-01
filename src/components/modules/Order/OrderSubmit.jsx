// Core
import { Fragment, useEffect, useState } from 'react'

// Dependencies
import { CSSTransition } from 'react-transition-group'

// Hooks
import { useRestart } from '../../../hooks/useRestart'

// Componentes
import { ModuleTitle } from "../../BasicModule"
import { AwesomeIcon } from "../../Awesome"
import Table from "../../table/Table"

// Services
import client from '../../../services/clientsService'
import commoditie from '../../../services/commoditiesService'
import order from '../../../services/ordersService'

// Others
import { findAttributeOf } from '../../../utils/functions'




const OrderItem = ({item, handleRemoveCommoditie, handleSetCant, handleUpdatePrice}) => {
    const usesKg = item.unit === "Kg";

    const [cantidad, setCantidad] = useState(usesKg && item.noUnit ? 0 : item.sellCant);

    const handleChangeAmount = element => {

        // Pregunta si lo ingresado no es un numero
        const sellCant = isNaN(Number(element.value)) ? 0 : element.value

        // Si tenemos el campo de kg, lo limpiamosf
        if (usesKg) 
            element.nextSibling.value = "";
        
        setCantidad(!usesKg ? sellCant : 0);
        handleSetCant(item.id, {sellCant, noUnit: usesKg});
    }

    const handleChangeKg = element => {
        const sellCant = isNaN(Number(element.value)) ? 0 : element.value

        element.previousSibling.value = "";

        setCantidad(sellCant);
        handleSetCant(item.id, {sellCant, noUnit: false});
    }

    const handleChangePrice = element => {
        // Pregunta si lo ingresado no es un numero
        const newPrice = isNaN(Number(element.value)) ? 0 : element.value;

        //element.previousSibling.value = "";
        
        handleUpdatePrice(item.id, newPrice);

    }

    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div className="row">
                <div className="col col-10">
                    <h6 className="my-0 mb-2">{item.codigo} - {item.descripcion}</h6>
                    
                    {/* Precio */}
                    <div 
                        className="input-group input-group-sm mb-3"
                        style={{maxWidth:"10rem !important"}}>
                        <span
                            className="input-group-text">
                            <AwesomeIcon icon="dollar-sign"/>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Precio..." 
                            aria-label="Precio"
                            onChange={e => handleChangePrice(e.target)}
                            value={item.precio}/>
                    </div>

                    {/* Cantidad */}
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
                            placeholder="Unidades..." 
                            aria-label="Unidades"
                            onChange={e => handleChangeAmount(e.target)}
                            value={!usesKg || (usesKg && item.noUnit) ? (item.sellCant==0?"":item.sellCant) : ""} />
                        { item.unit === "Kg" &&

                        <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Kilogramos..." 
                        aria-label="Kilogramos" 
                        onChange={e => handleChangeKg(e.target)}
                        value={usesKg && !item.noUnit ? (item.sellCant==0?"":item.sellCant) : ""}/>
                        }
                        
                    </div>
                </div>
            </div>
            <span className="text-muted">${Math.round((cantidad * item.precio) * 100) / 100}</span>
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
            key: "Phone",
            name: "Teléfono",
            type: "string"
        },
        {
            id: 3,
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 4,
            key: "City",
            name: "Localidad",
            type: "string"
        },
        {
            id: 5,
            key: "Balance",
            name: "Saldo",
            type: "number"
        },
        {
            id: 6,
            key: "Seller",
            name: "Vendedor",
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
        },
        {
            id: 4,
            key: "Seller",
            name: "Vendedor",
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
                handleGetData={client.get}
                handleSelectRow={handleSelectClientRow}/>
        </Fragment>
    );
}

export const SelectCommodity = ({handleSetCommodity, commodities}) => {

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
            key: "UnitOfMeasurement",
            name: "Unidad"
        },
        {
            id: 3,
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
            unit: findAttributeOf(row, 'UnitOfMeasurement'),
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
                handleGetData={commoditie.get}
                handleSelectRow={handleSelectCommodity}
                excludeRow={commodities}
                theme="success"/>
        </div>
    );
}

export const ShoppingCart = ({client, commodities, handleRemoveCommoditie, handleSetCant, handleSubmitPedido, handleCancelPedido, handleUpdatePrice}) => {
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
                        handleSetCant={handleSetCant}
                        handleUpdatePrice={handleUpdatePrice}/>)}

                {/* Total del carrito */}
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="row">
                        <div className="col-sm-12 my-2">
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
                    
                    <span className="text-muted my-2">Total: { 
                        commodities.length === 0
                            ? "$0"
                            //: "$" + commodities.reduce( (acc, cur) => acc + parseFloat(Math.round((cur.precio * cur.sellCant) * 100) / 100), 0)
                            : "$" + Math.round(commodities.reduce( (acc, cur) => acc + parseFloat(!cur.noUnit ? cur.precio * cur.sellCant : 0), 0) * 100) / 100
                    }</span>
                </li>
            </ul>
        </div>
    );
}

const SubmitFields = () => {
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

    useRestart(function() {
        setClient(initial.client);
        setCommodities(initial.commodities);
    })

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
            {...commodities[index], ...sellCant},
            ...commodities.slice(index + 1)
        ])
    }
    const handleUpdatePrice = (id, newPrice) => {
        const index = commodities.findIndex( p => p.id == id);

        setCommodities([
            ...commodities.slice(0,index),
            {...commodities[index], precio: newPrice},
            ...commodities.slice(index + 1)
        ])
    }

    // Guarda el pedido en la base de datos
    const handleSubmitPedido = () => {

        // Si encontramos algun item que le falte una cantidad, avisamos
        if (commodities.findIndex( commoditie => commoditie.sellCant == 0) !== -1) {
            alert("No se ha especificado una cantidad para un item");

        // Si no se cargo ningun item
        } else if (commodities.length === 0) {
            alert("No se ha especificado un item para el pedido");
            
        } else {

            const newOrder = {
                IdCustomer: client.id,
                Detail: commodities.map( ({id, sellCant, precio, noUnit}) => {return {
                    IdCommodity: id,
                    Amount: sellCant,
                    Price: precio,
                    NoUnit: noUnit
                }})
            }
    
            order.add(newOrder).then( result => {
                if (result) {
                    alert("Pedido cargado con exito");
    
                    // Forces reload of module
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
                        <ShoppingCart 
                            client={client} 
                            commodities={commodities}
                            handleSubmitPedido={handleSubmitPedido}
                            handleRemoveCommoditie={handleRemoveCommoditie}
                            handleSetCant={handleSetCant}
                            handleCancelPedido={handleCancelPedido}
                            handleUpdatePrice={handleUpdatePrice}/>
                    </div>
                </div>
            }
        </CSSTransition>
    );
}


const OrderSubmit = () => {    

    const moduleName = 'OrderSubmit'

    return (
        <Fragment>

            <ModuleTitle text="Crear Pedido"/>

            <SubmitFields />
        </Fragment>
    );
}

export default OrderSubmit;