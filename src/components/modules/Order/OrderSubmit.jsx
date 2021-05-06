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
import { AppContext } from '../../../App'
import { findAttributeOf } from '../../../utils/functions'


const OrderItem = ({item, handleRemoveCommoditie, handleSetCant, handleUpdatePrice}) => {
    const usesKg = item.unit === "Kg";

    const [cantidad, setCantidad] = useState(usesKg && item.noUnit ? 0 : item.sellCant);

    const handleChangeAmount = element => {

        // Pregunta si lo ingresado no es un numero
        const sellCant = isNaN(Number(element.value)) ? 0 : element.value

        // Si tenemos el campo de kg, lo limpiamos
        if (usesKg) 
            element.nextSibling.value = "";
        
        setCantidad(sellCant/*!usesKg ? sellCant : 0*/);
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
                            value={!usesKg || (usesKg && item.noUnit) ? (item.sellCant == 0 ? "" : item.sellCant) : ""} />
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
            
            <span className="text-muted">${Math.round((!item.noUnit ? item.precio * cantidad : item.precio * cantidad * item.avgWeight) * 100) / 100}</span>
            {/* <span className="text-muted">${Math.round((cantidad * item.precio) * 100) / 100}</span> */}
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
            key: "Balance",
            name: "Saldo",
            type: "number"
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
            key: "Address",
            name: "Dirección",
            type: "string"
        },
        {
            id: 2,
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

export const SelectCommodity = ({handleSetCommodity, selectedCommodities}) => {

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
            name: "Precio",
            type: 'number'
        },
        {
            id: 4,
            key: 'AverageWeight',
            name: 'AverageWeight',
            display: false,
        }
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
            avgWeight: findAttributeOf(row, 'AverageWeight'),
            sellCant: 0,
        }
        handleSetCommodity(commoditie);
    }

    return (
        <div className="col-md-6 order-md-1">
            <Table 
                columns={columns}
                filterBy={filters}
                customFilter={customFilter}
                handleGetData={commoditie.get}
                handleSelectRow={handleSelectCommodity}
                excludeRow={selectedCommodities}
                theme="success"/>
        </div>
    );
}

// TODO: Optimizar todo esto con un contexto o algo similar.
//       Tener en cuenta que este componente se utiliza en otros lados, cuidado con los handlers
export const ShoppingCart = ({client, commodities, handleRemoveCommoditie, handleSetCant, handleSubmitPedido, handleCancelPedido, handleUpdatePrice, handleUpdateDiscount, handleSetObservation}) => {

    const [discount, setDiscount] = useState('');

    const handleChangeDiscount = input => {
        // Pregunta si lo ingresado no es un numero
        let newValue = isNaN(Number(input.value)) ? 0 : input.value

        if (Number(newValue) > 100)
            newValue = '100'
        else if (Number(newValue) < 0)
            newValue = '0';

        setDiscount(newValue);
        handleUpdateDiscount(Number(newValue))
    }

    return (
        <div className="col-md-6 order-md-2 mb-4">
            <h4 className="mt-5 mb-3 responsive-h4">Agregados</h4>

            <ul className="list-group">

                {/* Cliente */}
                <li className="list-group-item list-group-item-success" style={{display:"flex"}}>
                    <div 
                        className="row"
                        style={{width:"100%"}}>

                        {/* Nombre del cliente seleccionado */}
                        <div className="col-11">
                            <h6>{client.name}</h6>
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

                
                {/* Observaciones */}
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="input-group input-group-sm my-2 mx-2">
                        <span
                            className="input-group-text">
                            <AwesomeIcon icon="sticky-note"/>
                        </span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Observaciones..." 
                            aria-label="Observaciones"
                            onChange={ e => handleSetObservation(e.target.value)}/>
                    </div>
                </li>

                {/* Total del carrito */}
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                    <div className="row">
                        <div className="col-sm-12 my-2">
                            <button 
                                className="btn btn-success me-2"
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

                    {/* Total y descuento */}
                    <AppContext.Consumer>
                        {/* State utilizado para saber si el usuario es cliente o no */}
                        { state => {

                        const total = Math.round(commodities.reduce( (acc, cur) => acc + parseFloat(!cur.noUnit ? cur.precio * cur.sellCant : cur.precio * cur.sellCant * cur.avgWeight), 0) * 100) / 100

                        let isDiscounted = discount !== '0' && discount !== '' && total !== 0;

                        const discountedTotal = (total * (1 - Number(discount) / 100)).toFixed(2)

                        return (
                        <div>
                            <div className="input-group flex-nowrap">
                                
                                {/* Total sin descuento */}
                                {/* Si el usuario es cliente, solo puede ver esto */}
                                <span 
                                    className="input-group-text"
                                    style={{
                                        textDecorationLine: isDiscounted ? 'line-through' : '',
                                    }}>
                                    {/* Calculo del total */}
                                    { commodities.length === 0
                                    ? '$0'
                                    : `$${total}`
                                    }

                                </span>
                                {/* Total con descuento */}
                                {/* Esto se muestra cuando el descuento !== 0 */}
                                { (isDiscounted && total !== 0) &&
                                <span 
                                    className="input-group-text"
                                    style={{color: 'var(--bs-success)'}}>
                                    ${ discountedTotal }
                                </span> }

                                
                                {/* Ingreso del descuento */}
                                <span className="input-group-text">%</span>
                                <input 
                                    style={{width:'4.5rem'}} 
                                    type="text" 
                                    className="form-control"
                                    aria-label="Discount" placeholder="dto"
                                    value={discount}
                                    onChange={e => handleChangeDiscount(e.target)}/>
                            </div>
                        </div>
                        )}}
                    </AppContext.Consumer>
                </li>
            </ul>
        </div>
    );
}

const SubmitFields = ({userClient = {id: -1, name: ""}}) => {
    const initial = {
        client: {
            id: -1,
            name: "",
        },
        commodities: []
    }
    const [client, setClient] = useState(userClient);
    const [commodities, setCommodities] = useState(initial.commodities);
    const [discount, setDiscount] = useState(0);
    const [observation, setObservation] = useState('');

    const restartModule = useRestart(function() {
        setClient(userClient);
        setCommodities(initial.commodities);
    })

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
                }}),
                Discount: discount,
                Observation: observation,
            }
    
            order.add(newOrder).then( result => {
                if (result) {
                    alert("Pedido cargado con exito");
    
                    // Forces reload of module
                    restartModule();
                } else {
                    alert("Hubo un error al cargar el pedido, vuelva a intentarlo.")
                }
            });
        }
    }
    const handleCancelPedido = () => {
        restartModule();
    }

    return (
        <CSSTransition in={client.id !== -1} timeout={500} classNames="order" exit={false}>
            {
                client.id === -1
                ?
                // Selector de clientes
                <div>
                    <SelectClient 
                        handleSetClient={setClient}/>
                </div>

                :
                <div>
                    <h4 className="mb-3">Seleccionar Productos</h4>
        
                    <div className="row">
        
                        {/* Seleccionador */}
                        <SelectCommodity 
                            selectedCommodities={commodities}
                            handleSetCommodity={handleSetCommodity}/>
        
                        {/* Carrito */}
                        {/* TODO: Optimizar los handlers */}
                        {/* Posiblemente pasar estos estados abajo y luego subirlos */}
                        {/* O tambien que shopping cart haga el submit, pasando objetos de este nivel abajo */}
                        <ShoppingCart 
                            client={client} 
                            commodities={commodities}
                            handleSubmitPedido={handleSubmitPedido}
                            handleRemoveCommoditie={handleRemoveCommoditie}
                            handleSetCant={handleSetCant}
                            handleCancelPedido={handleCancelPedido}
                            handleUpdatePrice={handleUpdatePrice}
                            handleUpdateDiscount={setDiscount}
                            handleSetObservation={setObservation}/>
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

            <AppContext.Consumer>
                { state => 
                state.user.isClient 
                ? <SubmitFields userClient={state.user.client}/> 
                : <SubmitFields />
                }
            </AppContext.Consumer>
            
        </Fragment>
    );
}

export default OrderSubmit;