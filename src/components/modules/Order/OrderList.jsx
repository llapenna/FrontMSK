// Core
import { Fragment, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

// Components
import { ModuleTitle } from "../../BasicModule"
import { ShoppingCart, SelectCommodity } from './OrderSubmit'
import Table from "../../table/Table"
import { AwesomeIcon } from '../../Awesome'

// Custom Hooks
import { useRestart } from '../../../hooks/useRestart'

// Services
import order from '../../../services/ordersService'


const OrderList = () => {    
    const initial = {
        orderId: -1,
        client: null,
        commodities: []
    }
    const [editing, setEditing] = useState(false);
    const [orderId, setOrderId] = useState(initial.orderId);
    const [client, setClient] = useState(initial.client);
    const [commodities, setCommodities] = useState(initial.commodities)

    const restartModule = useRestart(function() {
        setEditing(false);
        setOrderId(initial.orderId);
        setClient(initial.client);
        setCommodities(initial.commodities);
    });

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
        },
    ]

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
    const handleUpdatePedido = () => {

        // Si encontramos algun item que le falte una cantidad, avisamos
        if (commodities.findIndex( commoditie => commoditie.sellCant == 0) !== -1) {
            alert("No se ha especificado una cantidad para un item");

        // Si no se cargo ningun item
        } else if (commodities.length === 0) {
            alert("No se ha especificado un item para el pedido");
            
        } else {

            order.update(orderId, commodities).then( result => {
                if (result) {
                    alert("Pedido actualizado con exito");
    
                    // Forces reload of module
                    setEditing(false);
                } else {
                    alert("Hubo un error al actualizar el pedido, vuelva a intentarlo.")
                }
            });
        }
    }
    const handleCancelPedido = () => {
        setEditing(false);
        setClient(null);
        setCommodities([]);
    }

    // Debe cargar client y commodities con los respectivos datos del pedido
    const handleSelectOrder = row => {

        // Obtenemos el pedido
        order.get(row.attributes["dataid"].value)
            .then(data => {
                if (data !== null) {

                    setCommodities(data.commodities.map( c => {return {
                        id: c.IdComodity,
                        codigo: c.InternalCode,
                        descripcion: c.CommodityName,
                        precio: c.Price,
                        unit: c.Unit,
                        noUnit: c.NoUnit,
                        sellCant: c.Amount,
                    }}));
                    setClient(data.client)

                    setOrderId(Number(row.attributes["dataid"].value));

                    setEditing(prev => !prev)
                }
        })
    }

    const handleDeleteOrder = button => {
        // button > td > tr[dataid = x]
        const id = button.parentElement.parentElement.attributes['dataid'].value;

        order.delete(id)
            .then( result => {

                if (result) {
                    alert('Pedido eliminado con éxito.');

                    // Seteamos el id por un instante para forzar a la tabla a re-renderizarse
                    setOrderId(prev => id);

                    restartModule();
                } else {
                    alert("Hubo un error al actualizar el pedido, vuelva a intentarlo.")
                }
            })
    }

    return (
        <Fragment>

            <ModuleTitle text={editing ? "Editar pedido" : "Pedidos pendientes"}/>

            <CSSTransition in={editing} timeout={500} classNames="order" exit={false}>

                {editing
                ?
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
                            handleUpdatePrice={handleUpdatePrice}
                            handleRemoveCommoditie={handleRemoveCommoditie}
                            handleSetCant={handleSetCant}
                            handleCancelPedido={handleCancelPedido}
                            handleSubmitPedido={handleUpdatePedido}/>
                    </div>
                </div>
                :
                <div>
                    <Table 
                        columns={columns}
                        filterBy={null}
                        handleGetData={order.getAll}
                        handleSelectRow={handleSelectOrder}
                        captionText="Selecciona un pedido para editarlo."
                        customCell={[{
                            id: 0, 
                            component: 
                                <button 
                                    className="btn btn-danger"
                                    onClick={e => handleDeleteOrder(e.currentTarget)}>
                                    <AwesomeIcon icon="times"/>
                                </button>
                            }]}
                        key={orderId}/>
                </div>
                }
            </CSSTransition>
        </Fragment>
    );
}

export default OrderList;