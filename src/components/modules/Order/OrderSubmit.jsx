// Core
import { Fragment, useState } from 'react'

// Dependencies
import { CSSTransition } from 'react-transition-group'

// Hooks
import { useRestart } from '../../../hooks/useRestart'

// Componentes
import { ModuleTitle } from "../../BasicModule"
import Table from "../../table/Table"
import ConfigureOrder from './ConfigureOrder'

// Services
import client from '../../../services/clientsService'
import order from '../../../services/ordersService'

// Others
import { AppContext } from '../../../App'
import { findAttributeOf } from '../../../utils/functions'



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


const SubmitFields = ({userClient = {id: -1, name: ""}}) => {
    const [client, setClient] = useState(userClient);

    const restartModule = useRestart(function() {
        setClient(userClient);
    })

    // Guarda el pedido en la base de datos
    const handleSubmitOrder = ({client, commodities, observation, discount, receipt}) => {

        // Si encontramos algun item que le falte una cantidad, avisamos
        if (commodities.findIndex( c => c.sellCant === 0) !== -1) {
            alert("No se ha especificado una cantidad para un item");

        // Si no se cargo ningun item
        } else if (commodities.length === 0) {
            alert("No se ha especificado un item para el pedido");
            
        } else {

            // TODO: Que esto se encargue el servicio, solo se le pasa el objeto que usa la UI
            const newOrder = {
                IdCustomer: client.id,
                Detail: commodities.map( ({id, amount, price, noUnit}) => {return {
                    IdCommodity: id,
                    Amount: amount,
                    Price: price,
                    NoUnit: noUnit
                }}),
                Discount: discount,
                Observation: observation,
                Receipt_Type: receipt,
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
    const handleCancelOrder = () => {
        restartModule();
    }

    return (
        <CSSTransition in={client.id !== -1} timeout={500} classNames="order" exit={false}>
            {
                client.id === -1
                ?
                <div>
                    {/* // Selector de clientes */}
                    <SelectClient 
                        handleSetClient={setClient}/>
                </div>

                :
                <div>
                    {/* Configuracion del pedido (items, comprobante, descuento) */}
                    <ConfigureOrder
                        client={client} 
                        handleSubmitOrder={handleSubmitOrder}
                        handleCancelOrder={handleCancelOrder}/>
                </div>
            }
        </CSSTransition>
    );
}


const OrderSubmit = () => {    

    //const moduleName = 'OrderSubmit'

    return (
        <Fragment>

            <ModuleTitle text="Crear Pedido"/>

            <AppContext.Consumer>
                { state => {
                    console.log('STATE', state)
                    return (state.user.isCustomer 
                        ? <SubmitFields userClient={state.user.customerInfo}/> 
                        : <SubmitFields />)
                }
                
                }
            </AppContext.Consumer>
            
        </Fragment>
    );
}

export default OrderSubmit;