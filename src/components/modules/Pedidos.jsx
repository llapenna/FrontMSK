import { Fragment, useState } from "react"

import { getClients } from '../../services/clientsService'
import { getProducts } from '../../services/productsService'

import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from "../Awesome"
import Table from "../Table"

const tableColumns = [
    {
        id: 0,
        key: "razonSocial",
        name: "Razon Social"
    },
    {
        id: 1,
        key: "cuit",
        name: "CUIT"
    },
    {
        id: 2,
        key: "fecha",
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
        key: "codigo",
        name: "Codigo"
    },
    {
        id: 1,
        key: "descripcion",
        name: "Descripcion"
    },
    {
        id: 2,
        key: "cantidad",
        name: "Stock"
    },
    {
        id: 3,
        key: "kilos",
        name: "Kilos"
    },
    {
        id: 4,
        key: "precio",
        name: "Precio"
    },

]

const OrderItem = ({item}) => {
    const [cantidad, setCantidad] = useState(0);

    const handleOnChange = element => {
        setCantidad(element.value);
    }
    return (
        <li className="list-group-item d-flex justify-content-between lh-condensed">
            <div>
                <h6 className="my-0">{item.codigo}</h6>
                <small className="text-muted">{item.descripcion}</small>
                <input 
                    className="form-control form-control-sm" 
                    type="text" 
                    placeholder="Cantidad..."
                    onChange={e => handleOnChange(e.target)}/>
            </div>
            <span className="text-muted">Total: ${cantidad * item.precio}</span>
        </li>
    )
}

const SubmitPedido = () => {
    const initial = {
        client: {
            id: null,
            razonSocial: null,
            cuit: null,
            telefono: null
        },
        products: []
    }
    const [client, setClient] = useState(initial.client);
    const [products, setProducts] = useState(initial.products);

    const handleSelectClientRow = row => {

        // TODO: Investigar por que se pasa el td y no el tr
        row = row.parentElement;
        
        const client = {
            id: row.attributes["dataid"].value,
            razonSocial: row.childNodes[1].innerText, 
            cuit: row.childNodes[2].innerText,
            telefono: row.childNodes[3].innerText
        }

        setClient(client);
    }
    const handleSelectProductRow = row => {

        row = row.parentElement;

        // Obtenemos la informacion desde la fila
        // TODO: Optimizar carga de datos
        const newProduct = {
            id: row.attributes["dataid"].value,
            codigo: row.childNodes[1].innerText,
            descripcion: row.childNodes[2].innerText,
            kilos: row.childNodes[2].innerText,
            precio: row.childNodes[3].innerText,
        }

        setProducts([...products, newProduct])
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
                        handleGetData={getProducts}
                        handleSelectRow={handleSelectProductRow}/>
                </div>

                {/* Carrito */}
                <div className="col-md-4 order-md-2 mb-4">
                    <h2 className="mt-5 mb-3 responsive-h2">Agregados</h2>

                    <ul className="list-group">
                        { products.map( ({id, descripcion, codigo, precio}, i) => 
                            <OrderItem 
                                key={id}
                                itemid={id}
                                item={{id, descripcion, codigo, precio}}/>)}
                    </ul>

                    {/* Total del carrito */}
                    { //products.length > 0 && 
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <button className="btn btn-success">Confirmar pedido</button>
                        <span className="text-muted">Total: { 
                            products.length === 0
                                ? "$0"
                                : "products."
                             }</span>
                    </li>}

                </div>
            </div>            
        </Fragment>
    );
}

const Pedidos = () => {    
    return (
        <Fragment>
            <ModuleTitle text="Pedidos"/>
            <div className="accordion custom-accordion" id="accordionPedidos">

                <ModuleSection
                    i={0}
                    sectionName="Nuevo pedido"
                    section= { <SubmitPedido /> }
                    moduleName={"Pedidos"}>
                </ModuleSection>
                
                <ModuleSection
                    i={1}
                    sectionName="Listado"
                    section={ 
                        <Table 
                            tableColumns={tableColumns}/> }
                            moduleName={"Pedidos"}>
                </ModuleSection>
            </div>
        </Fragment>
    );
}

export default Pedidos;