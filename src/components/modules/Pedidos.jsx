import { Fragment, useState } from "react"

import { findAttributeOf, getClients } from '../../services/clientsService'
import { getCommodities } from '../../services/commoditiesService'
import { getOrders } from "../../services/ordersService"

import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from "../Awesome"
import Table from "../Table"

const tableColumns = [
    {
        id: 0,
        key: "Name",
        name: "Razon Social"
    },
    {
        id: 1,
        key: "Cuit",
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
        key: "Name",
        name: "Razon Social"
    },
    {
        id: 1,
        key: "Cuit",
        name: "CUIT"
    },
    {
        id: 2,
        key: "Phone",
        name: "Telefono"
    }
]

const productosColumns = [
    {
        id: 0,
        key: "InternalCode",
        name: "Codigo"
    },
    {
        id: 1,
        key: "Name",
        name: "Descripcion"
    },
    {
        id: 2,
        key: "Line",
        name: "Linea"
    },
    {
        id: 3,
        key: "Heading",
        name: "Rubro"
    },
    {
        id: 4,
        key: "Stock",
        name: "Stock"
    },
    {
        id: 5,
        key: "Precio",
        name: "Precio"
    },
]

const OrderItem = ({item, handleRemoveProduct, handleSetCant}) => {
    const [cantidad, setCantidad] = useState(0);

    const handleOnChange = element => {
        const cant = item.stock - element.value > 0 ? element.value : item.stock
        element.value = cant;
        setCantidad(cant);
        handleSetCant(item.id, cant);
    }
    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div>
                <h6 className="my-0">{item.codigo}</h6>
                <small className="text-muted">{item.descripcion}</small>
                
                <div 
                    className="input-group input-group-sm mb-3"
                    style={{maxWidth:"10rem !important"}}>
                    <button 
                        className="btn btn-danger" 
                        type="button"
                        onClick={ () => handleRemoveProduct(item.id)}>
                        <AwesomeIcon icon="times"/>
                    </button>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Cantidad..." 
                        aria-label="Example text with two button addons"
                        onChange={e => handleOnChange(e.target)} />
                </div>
            </div>
            <span className="text-muted">Total: ${cantidad * item.precio}</span>
        </li>
    )
}

const SubmitPedido = () => {
    const initial = {
        client: {
            id: null,
            name: null,
            cuit: null,
            phone: null
        },
        products: []
    }
    const [client, setClient] = useState(initial.client);
    const [products, setProducts] = useState(initial.products);

    const handleSelectClientRow = row => {
        
        const client = {
            id: row.attributes["dataid"].value,
            name: findAttributeOf(row, "Name"),
            cuit: findAttributeOf(row, "Cuit"),
            phone: findAttributeOf(row,"Phone")
        }
        setClient(client);
    }
    const handleSelectProductRow = row => {

        // Obtenemos la informacion desde la fila
        // TODO: Optimizar carga de datos
        const newProduct = {
            id: row.attributes["dataid"].value,
            codigo: row.childNodes[1].innerText,
            descripcion: row.childNodes[2].innerText,
            stock: row.childNodes[5].innerText,
            precio: row.childNodes[6].innerText,
            sellCant: 0,
        }
        setProducts([...products, newProduct])
    }

    const handleRemoveProduct = id => {
        setProducts(products.filter( p => p.id !== id))
    }
    const handleSetCant = (id, sellCant) => {
        const index = products.findIndex( p => p.id == id);

        setProducts([
            ...products.slice(0,index),
            {...products[index], sellCant},
            ...products.slice(index + 1)
        ])
    }

    // Guarda el pedido en la base de datos
    const handleSubmitPedido = () => {

    }

    // El registro del pedido es secuencial
    // 1: elegir cliente
    // 2: elegir items
    // 3: ???
    // 4: profit!
    
    // TODO: Optimizar esto y extraerlo de alguna forma
    return (
        client.id == null
        ?
        // Selector de clientes
        <Fragment>
            
            <h4 className="mb-3">Seleccionar Cliente</h4>

            <Table 
                tableColumns={clientColumns}
                handleGetData={getClients}
                handleSelectRow={handleSelectClientRow}/>
        </Fragment>
        
        : 
        <Fragment>

            <h4 className="mb-3">Seleccionar Productos</h4>

            <div className="row">
                {/* Seleccionador */}
                <div className="col-md-8 order-md-1">
                    <Table 
                        tableColumns={productosColumns}
                        handleGetData={getCommodities}
                        handleSelectRow={handleSelectProductRow}
                        excludeRow={products}/>
                </div>

                {/* Carrito */}
                <div className="col-md-4 order-md-2 mb-4">
                    <h4 className="mt-5 mb-3 responsive-h4">Agregados</h4>

                    <ul className="list-group">

                    {/* Cliente */}
                    <li className="list-group-item list-group-item-success">
                        <h6>{client.name}</h6>
                        <small>{client.cuit}</small>
                    </li>

                        { products.map( (product, i) => 
                            <OrderItem 
                                key={product.id}
                                item={product}
                                handleRemoveProduct={handleRemoveProduct}
                                handleSetCant={handleSetCant}/>)}

                        {/* Total del carrito */}
                        { //products.length > 0 && 
                        <li className="list-group-item d-flex justify-content-between lh-condensed">
                            <button className="btn btn-success">Confirmar pedido</button>
                            <span className="text-muted">Total: { 
                                products.length === 0
                                    ? "$0"
                                    : "$" + products.reduce( (acc, cur) => acc + parseInt(cur.precio * cur.sellCant), 0)
                            }</span>
                        </li>}
                    </ul>
                </div>
            </div>            
        </Fragment>
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
                    sectionName="Listado"
                    section={ <Table 
                                tableColumns={tableColumns}
                                handleGetData={getOrders}/> }
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