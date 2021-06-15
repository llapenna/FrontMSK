// Core
import { Fragment, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

// Components
import { ModuleTitle } from "../../BasicModule"
import Table from "../../table/Table"
import { AwesomeIcon } from '../../Awesome'
import ConfigureOrder from './ConfigureOrder'

// Custom Hooks
import { useRestart } from '../../../hooks/useRestart'

// Utils
import { failed } from '../../../utils/functions'

// Services
import order from '../../../services/ordersService'


const OrderList = () => {    

    const [editing, setEditing] = useState(false)
    const [orderId, setOrderId] = useState(-1)

    const restartModule = useRestart(function() {
        setEditing(false);
        setOrderId(-1);
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

    // Guarda el pedido en la base de datos
    const handleUpdatePedido = ({commodities, observation, discount, receipt}) => {

        // Si encontramos algun item que le falte una cantidad, avisamos
        if (commodities.findIndex( commoditie => commoditie.amount === 0) !== -1) {
            alert("No se ha especificado una cantidad para un item");

        // Si no se cargo ningun item
        } else if (commodities.length === 0) {
            alert("No se ha especificado un item para el pedido");
            
        } else {

            order.update(orderId, commodities, observation, discount, receipt)
                .then( result => {
                    if (result) {
                        alert("Pedido actualizado con exito");
        
                        // Forces reload of module
                        setEditing(false);
                    } else {
                        alert("Hubo un error al actualizar el pedido, vuelva a intentarlo.")
                    }
            })
        }
    }
    const handleCancelPedido = () => {
        setEditing(false);
    }

    // Debe cargar client y commodities con los respectivos datos del pedido
    const handleSelectOrder = row => {

        setOrderId(Number(row.attributes["dataid"].value));
        setEditing(!editing)
    }
    const handleDeleteOrder = button => {
        // button > td > tr[dataid = x]
        const id = button.parentElement.parentElement.attributes['dataid'].value;

        order.delete(id)
            .then( result => {


                if (result) {
                    alert('Pedido eliminado con éxito.');

                    // Seteamos el id por un instante para forzar a la tabla a re-renderizarse
                    setOrderId(id);

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
                    {orderId !== -1 &&
                    <ConfigureOrder
                        orderid={orderId} 
                        handleSubmitOrder={handleUpdatePedido}
                        handleCancelOrder={handleCancelPedido}/>
                    }
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