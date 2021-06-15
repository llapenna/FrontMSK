import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'
import { failed } from '../utils/functions'

const service = 'order'

const getAllOrders = async ({page=1, filters=[]}) => {

    const defaultResultsPerPage = 10;
    const method = 'getAll';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            resultsPerPage: defaultResultsPerPage,
            filters,
            token: myCookies.user.get()?.token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.status === 200){

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        const data = await response.json().then(data => data);

        // Devuelve la lista de pedidos
        return {
            maxPage: 1, 
            rows: data.map( row => {return {
                ...row,
                // Formatea la fecha
                Date: new Date(row.Date).toLocaleString()
            }})
        };
    }
    // Devolvió 401, no devuelve nada
    else return [];
}

const getOrder = id => {

    const method = 'getOrder';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            OrderId: id,
            token: myCookies.user.get()?.token
        })
    }

    return fetch(`${apiHost}/${service}/${method}/`, options)
        .then( r => {


            return r.status === 200 
            // Se pudo obtener el pedido
            ? r.json() 
            : r.status
        })
        .then( d => {
            
            // No hubo error, se procede a tratar la informacion
            if (!failed(d))
                return {
                    id: d[0].Id,
                    commodities: d[0].Detail.map(c => { return {
                        id: c.IdCommodity,
                        name: c.CommodityName,
                        code: c.InternalCode,
                        price: c.Price,
                        amount: c.Amount,
                        unit: c.Unit,
                        avgWeight: c.AvgWeight,
                        noUnit: c.NoUnit,
                        discount: c.Discount,
                    }}),
                    client: {
                        id: d[0].IdCustomer,
                        cuit: d[0].CustomerCUIT,
                        name: d[0].CustomerName,
                    },
                    observation: d[0].Observation,
                    discount: d[0].Discount,
                    receipt: d[0].Receipt_type
                }
            else if (d.error === 401)
                return {id: -1, error: 'No tiene los permisos para poder realizar esta accion'}
            else return {id: -1, error: 'Ocurrio un error al realizar la peticion'}
        })
}

const addOrder = async o => {

    const method = 'insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            // Mapeo del objeto
            IdCustomer: o.customerid,
            Detail: o.commodities.map( c => { return {
                IdCommodity: c.id,
                Amount: c.amount,
                Price: c.price,
                NoUnit: c.noUnit,
                Discount: c.discount,
            }}),
            Discount: o.discount,
            Observation: o.observation,
            Receipt_Type: o.receipt,
            token: myCookies.user.get()?.token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, se creó el cliente
    if (response.status === 200) {
        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        return true;
    }
    else return false
}

const updateOrder = async (id, uDetail, uObservation, uDiscount, uReceipt) => {
    const method = 'updateOrder';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            OrderId: id,
            Detail: uDetail.map( c => { return {
                Id: c.id,
                Precio: c.price,
                Unit: c.unit,
                Nounit: c.noUnit,
                SellCant: c.amount,
                Discount: c.discount
            }}),
            Observation: uObservation,
            Discount: uDiscount,
            Receipt_Type: uReceipt,
            token: myCookies.user.get()?.token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Consulta exitosa
    if (response.status === 200) {

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        return true
    } else return false;
}

const deleteOrder = async id => {

    const method = 'removeOrder';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Id: id,
            token: myCookies.user.get().token
        })
    }

    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response);

    // Consulta exitosa
    if (response.status === 200) {

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        // Pedido eliminado exitosamente
        return true
    } else return false;
}

const order = {
    add: addOrder,
    getAll: getAllOrders,
    get: getOrder,
    update: updateOrder,
    delete: deleteOrder,
}

export default order