import { Fragment } from "react"

import { ModuleTitle, ModuleSection, Submit } from "../BasicModule"
import Table from "../Table"

const fields = [
    {
        type: "text",
        icon: "user",
        placeholder: "Cliente"
    },
    {
        type: "text",
        icon: "barcode",
        placeholder: "Producto"
    },
    {
        type: "text",
        icon: "cubes",
        placeholder: "Cantidad"
    },
    {
        type: "text",
        icon: "dollar-sign",
        placeholder: "Precio Total"
    }
]

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

const Pedidos = () => {    
    return (
        <Fragment>
            <ModuleTitle text="Pedidos"/>
            <div className="accordion" id="accordionPedidos">

                <ModuleSection
                    i={0}
                    sectionName="Nuevo pedido"
                    section= { <Submit fields={fields} /> }
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