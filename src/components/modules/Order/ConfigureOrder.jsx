// Core
import {createContext, useState, useContext, useEffect, Fragment} from 'react'

// Components
import {AwesomeIcon} from '../../Awesome'
import Table from "../../table/Table"
import Radio from '../../bootstrap/Radio'

// Services
import commodity from '../../../services/commoditiesService'
import order from '../../../services/ordersService'
import receiptService from '../../../services/receiptsService'

// Others
import { findAttributeOf } from '../../../utils/functions'
import { AppContext } from '../../../App'


const ConfigureContext = createContext();


const OrderItem = ({commodity}) => {

    const context = useContext(ConfigureContext)
    const appContext = useContext(AppContext)

    const usesKg = commodity.unit === "Kg";

    const handleUpdatePrice = newPrice => {
        if (!isNaN(newPrice))
            context.commodities.edit(commodity.id, {price: newPrice})
    }
    const handleUpdateDiscount = newDiscount => {
        let discount = isNaN(newDiscount) ? 0 : newDiscount

        if (discount > 100)
            discount = 100
        else if (discount < 0)
            discount = 0

        context.commodities.edit(commodity.id, {discount})
    }

    const handleUpdateAmount = newAmount => {
        if (!isNaN(newAmount))
            context.commodities.edit(commodity.id, {amount: newAmount, noUnit: usesKg})
    }
    const handleUpdateKgAmount = newKgAmount => {
        if (!isNaN(newKgAmount))
            context.commodities.edit(commodity.id, {amount: newKgAmount, noUnit: false})
    }

    // Calculo del total en base al precio, la cantidad y el peso promedio (si es necesario utilizarlo)
    const total = Math.round( commodity.price * commodity.amount * 
        (commodity.noUnit ? commodity.avgWeight : 1) * 100) / 100

    const isDiscounted = commodity.discount > 0 && total !== 0
    const dtotal = (total * (1 - Number(commodity.discount) / 100)).toFixed(2)

    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div className="row">
                <div className="col col-10">

                    {/* Informacion */}
                    <h6 className="my-0 mb-2">{commodity.code} - {commodity.name}</h6>

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
                            onChange={e => handleUpdatePrice(parseFloat(e.currentTarget.value))}
                            value={commodity.price}/>

                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Dto..." 
                            aria-label="Dto"
                            onChange={e => handleUpdateDiscount(parseFloat(e.currentTarget.value))}
                            value={commodity.discount}
                            {...{disabled: appContext.user.isCustomer}}/>
                        <span
                            className="input-group-text">
                            %
                        </span>
                    </div>

                    {/* Elegir cantidad */}
                    <div 
                        className="input-group input-group-sm mb-3"
                        style={{maxWidth:"10rem !important"}}>
                        
                        <button 
                            className="btn btn-danger" 
                            type="button"
                            onClick={ () => context.commodities.remove(commodity.id)}>
                            <AwesomeIcon icon="times"/>
                        </button>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Unidades..." 
                            aria-label="Unidades"
                            onChange={e => handleUpdateAmount(parseFloat(e.currentTarget.value))}
                            value={!usesKg || (usesKg && commodity.noUnit) ? (commodity.amount == 0 ? "" : commodity.amount) : ""} />
                        { commodity.unit === "Kg" &&

                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Kilogramos..." 
                            aria-label="Kilogramos" 
                            onChange={e => handleUpdateKgAmount(parseFloat(e.currentTarget.value))}
                            value={usesKg && !commodity.noUnit ? (commodity.amount==0?"":commodity.amount) : ""}/>
                        }
                        
                    </div>
                </div>
            </div>

            {/* Totales */}
            <span className='text-muted'>
                {/* Total sin descuento */}
                <span
                    // Si hay descuento, tiene que separarse un poco
                    className={isDiscounted ? 'pe-3' : ''}
                    style={{textDecorationLine: isDiscounted ? 'line-through' : ''}}>
                    ${total}
                </span>

                {/* Total con descuento */}
                { isDiscounted &&
                <span
                    style={{color: 'var(--bs-success)'}}>
                    ${dtotal}
                </span>}
            </span>
        </li>
    )
}

export const ConfigureOrder = ({orderid = -1, client = {id: -1, name: 'null'}, handleSubmitOrder, handleCancelOrder}) => {
    const [orderClient, setOrderClient] = useState(client);
    const [commodities, setCommodities] = useState([])
    const [observation, setObservation] = useState('')
    const [discount, setDiscount] = useState(0)
    const [receipt, setReceipt] = useState(-1)
    const [fetchedReceipts, setFetchedReceipts] = useState([])

    const addCommodity = newC => {
        // Agregamos la nueva commodity al array
        setCommodities(prev => [...prev, newC])
    }
    const removeCommodity = cId => {
        // Con 'filter' excluimos la commodity indicada
        setCommodities(prev => prev.filter( p => p.id !== cId))
    }
    const editCommodity = (id, newValues) => {

        console.log(id,newValues)

        setCommodities(prev => {
            // Obtenemos posicion del item que queremos editar
            const i = prev.findIndex( p => p.id === id)

            // Existe el item en el array
            if (i !== -1) {
                if (prev.length > 1)
                    // Devolvemos el mismo array, pero con el item modificado
                    return (
                        [...prev.slice(0, i),
                        {...prev[i], ...newValues},
                        ...prev.slice(i+1)]
                    )
                else 
                    return (
                        [{...prev[i], ...newValues}]
                    )
            }
        })
    }

    // Si tenemos un order id (es decir, estamos editando un pedido existente), lo buscamos y actualizamos la UI
    useEffect( () => {
        // GET ORDER BY ID
        if (orderid !== -1) {
            order.get(orderid)
                .then(order => {

                    // Obtenemos el pedido
                    if (order.id !== -1) {
                        setOrderClient(order.client)
                        setCommodities(order.commodities)
                        setObservation(order.observation)
                        setDiscount(order.discount)
                        setReceipt(order.receipt)
                    }
                    // Ocurrio algun error
                    else {
                        alert('Ocurrió un error al cargar el pedido, inténtelo más tarde.')
                        handleCancelOrder()
                    }
            })
        }
    }, [])
    
    // Obtener los tipos de comprobantes
    useEffect( () => {
        receiptService.getAll().then(data => {
            setFetchedReceipts(data)
            
            // Por defecto dejamos 'activado' el primero que llega si es que estamos
            // creando un pedido
            if (orderid === -1)
                setReceipt(data[0].id)
        })
    }, [])


    return (
        <Fragment>
            <ConfigureContext.Provider 
                value={{
                    client: {
                        get: orderClient,
                    },
                    commodities: {
                        get: commodities,
                        add: addCommodity,
                        remove: removeCommodity,
                        edit: editCommodity,
                    },
                    observation: {
                        get: observation,
                        set: setObservation
                    },
                    discount: {
                        get: discount,
                        set: setDiscount
                    },
                    receipt: {
                        get: receipt,
                        set: setReceipt,
                    }
                }}>

                <SelectReceipt 
                    receipts={fetchedReceipts}
                    checked={receipt}/>

                <h4 className="mb-3">Seleccionar Productos</h4>
                <div className='row'>
                    <SelectCommodity />
                    <ShoppingCart
                        handleSubmitOrder={handleSubmitOrder}
                        handleCancelOrder={handleCancelOrder}/>
                </div>
            </ConfigureContext.Provider>
        </Fragment>
    )
}

const ShoppingCart = ({handleSubmitOrder, handleCancelOrder}) => {
    const context = useContext(ConfigureContext)

    const handleSetObservation = obs => {
        context.observation.set(obs)
    }

    const handleSetDiscount = discount => {

        let newValue = isNaN(discount) ? 0 : discount

        if (newValue > 100)
            newValue = 100
        else if (newValue < 0)
            newValue = 0

        context.discount.set(newValue);
    }


    return (
        <ConfigureContext.Consumer>
            { state =>
            
            <div className="col-md-6 order-md-2 mb-4">
                <h4 className="mt-5 mb-3 responsive-h4">Agregados</h4>

                {/* Informacion, productos cargados y botones */}
                <ul className="list-group">

                    {/* Informacion del cliente */}
                    <li 
                        className="list-group-item list-group-item-success" 
                        style={{display:"flex"}}>
                        <div 
                            className="row"
                            style={{width:"100%"}}>

                            <div className="col-11">
                                <h6>{state.client.get.name}</h6>
                            </div>

                            {/* Icono de carrito */}
                            <div className="col-1">
                                <i className="fas fa-shopping-cart fa-2x py-2 pe-2"></i>
                            </div>

                        </div>
                    </li>

                    {/* Items seleccionados */}
                    { state.commodities.get.map( c =>
                        <OrderItem 
                            key={c.id}
                            commodity={c}/>)
                    }

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
                                onChange={ e => handleSetObservation(e.currentTarget.value)}
                                value={state.observation.get}/>
                        </div>
                    </li>

                    
                    {/* Total y descuento */}
                    <li className="list-group-item d-flex justify-content-end lh-condensed">
                        {/* Contexto utilizado para saber si el usuario logueado es un cliente */}
                        <AppContext.Consumer>
                            { appState => {
                            
                                // Calculamos el total
                                const total = Math.round(context.commodities.get.reduce(
                                    (acc, cur) => acc + parseFloat(
                                        cur.price * cur.amount *
                                        // Debe considerar el avgWeight?
                                        (cur.noUnit ? cur.avgWeight : 1) *
                                        // Debe considerar un descuento?
                                        (1 - (cur.discount > 0 ? cur.discount / 100 : 0))
                                    ), 0) * 100) / 100

                                const isDiscounted = 
                                    // Descuento en el total
                                    (state.discount.get > 0 && total !== 0) 

                                // Calculamos total con descuento
                                const dTotal = (total * (1 - Number(context.discount.get) / 100)).toFixed(2)

                                return (
                                    <div>
                                        <div className="input-group flex-nowrap">

                                            {/* Total sin descuento */}
                                            <span 
                                                className="input-group-text"
                                                style={{
                                                    textDecorationLine: isDiscounted ? 'line-through' : '',
                                                }}>
                                                {/* Valor */}
                                                { context.commodities.get.length === 0
                                                ? '$0'
                                                : `$${total}`
                                                }
                                            </span>

                                            {/* Total con descuento */}
                                            {/* Esto se muestra cuando el descuento !== 0 */}
                                            { isDiscounted &&
                                            <span 
                                                className="input-group-text"
                                                style={{color: 'var(--bs-success)'}}>
                                                ${ dTotal }
                                            </span> }

                                            {/* Ingreso del descuento */}
                                            <input 
                                                style={{width:'4.5rem'}} 
                                                type="text" 
                                                className="form-control"
                                                aria-label="Discount" placeholder="dto"
                                                value={context.discount.get}
                                                onChange={e => handleSetDiscount(parseFloat(e.currentTarget.value))}
                                                {...{disabled: appState.user.isCustomer}}/>
                                            <span className="input-group-text">%</span>
                                        </div>
                                    </div>
                                )
                            }}
                        </AppContext.Consumer>
                    </li>


                    {/* Confirmacion del pedido */}
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div className="row">
                            <div className="col-sm-12 my-2">
                                <button 
                                    className="btn btn-success me-2"
                                    onClick={() => handleSubmitOrder({
                                        client: state.client.get,
                                        commodities: state.commodities.get, 
                                        observation: state.observation.get, 
                                        discount: state.discount.get,
                                        receipt: state.receipt.get,
                                        })}>
                                    <AwesomeIcon icon='check' />
                                </button>
                                <button 
                                    className="btn btn-danger"
                                    // TODO: Boton de cancelar
                                    onClick={handleCancelOrder}>
                                    <AwesomeIcon icon='times' />
                                </button>                            
                            </div>
                        </div>
                    </li>

                </ul>
            </div>}
        </ConfigureContext.Consumer>
    )
}

const SelectCommodity = () => {

    const context = useContext(ConfigureContext)

    const columns = [
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
            type: 'number'
        },
        {
            id: 4,
            key: 'avgWeight',
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
        const c = {
            id: row.attributes["dataid"].value,
            code: findAttributeOf(row, 'code'),
            name: findAttributeOf(row, 'name'),
            price: findAttributeOf(row, 'price'),
            unit: findAttributeOf(row, 'unit'),
            avgWeight: findAttributeOf(row, 'avgWeight'),
            amount: 0,
            discount: 0,
        }

        context.commodities.add(c)
    }

    return (
        <div className="col-md-6 order-md-1">
            <Table 
                columns={columns}
                filterBy={filters}
                customFilter={customFilter}
                handleGetData={commodity.get}
                handleSelectRow={handleSelectCommodity}
                excludeRow={context.commodities.get}
                theme="success"/>
        </div>
    );
}

const SelectReceipt = ({receipts, checked}) => {
    const context = useContext(ConfigureContext)

    const handleChangeRadio = id => {
        context.receipt.set(id)
    }

    return (
        <Fragment>
            <h4 className="mb-3">Configurar Pedido</h4>

            <div className='row mb-5'>
                {/* Tipo de comprobante */}
                <Radio 
                    buttons={receipts}
                    checked={checked}
                    handleChange={handleChangeRadio}/>
            </div>
        </Fragment>
    )
}

export default ConfigureOrder