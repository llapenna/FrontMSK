import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

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
            token: myCookies.user.get().token
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

const getOrder = async id => {

    const defaultReturn = {id: -1}

    const method = 'getOrder';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            OrderId: id,
            token: myCookies.user.get().token
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

        const data = await response.json().then(data => data);

        if (data.length > 0) {
            // Devuelve el pedido especificado en el formato que usa la UI
            return {
                id: data[0].Id,
                commodities: data[0].Detail.map(c => { return {
                    id: c.IdCommodity,
                    // id: c.IdComodity,
                    name: c.CommodityName,
                    code: c.InternalCode,
                    price: c.Price,
                    amount: c.Amount,
                    unit: c.Unit,
                    avgWeight: c.AvgWeight,
                    noUnit: c.NoUnit,
                }}),
                client: {
                    id: data[0].IdCustomer,
                    cuit: data[0].CustomerCUIT,
                    name: data[0].CustomerName,
                },
                observation: data[0].Observation,
                discount: data[0].Discount,
                receipt: data[0].Receipt_type
            };
        }
        else return defaultReturn
            
    // Devolvemos un valor erróneo
    } else return defaultReturn;
}

const addOrder = async order => {

    const method = 'insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...order,
            token: myCookies.user.get().token
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
            Detail: uDetail.map( d => { return {
                Id: d.id,
                Precio: d.price,
                Unit: d.unit,
                Nounit: d.noUnit,
                SellCant: d.amount,
            }}),
            Observation: uObservation,
            Discount: uDiscount,
            Receipt_Type: uReceipt,
            token: myCookies.user.get().token
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