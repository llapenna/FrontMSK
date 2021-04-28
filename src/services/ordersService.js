import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'order'

export const getAllOrders = async ({page=1, filters=[]}) => {

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
        await fetch(`${apiLocation}/${method}/`, options)
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
        await fetch(`${apiLocation}/${method}/`, options)
            .then(response => response)

    // Consulta exitosa
    if (response.status === 200) {

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        const data = await response.json().then(data => data);

        // Devuelve el pedido especificado
        return {
            commodities: data[0].Detail,
            client: {
                cuit: data[0].CustomerCUIT,
                name: data[0].CustomerName,
            }
        };
    } else return {};
}

export const addOrder = async order => {

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
        await fetch(`${apiLocation}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, se creó el cliente
    if (response.status == 200) {
        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        return true;
    }
    else return false
}

const updateOrder = async (id, updatedDetail) => {
    const method = 'updateOrder';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            OrderId: id,
            Detail: updatedDetail,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
            .then(response => response)

    console.log(response);

    // Consulta exitosa
    if (response.status === 200) {

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();


        //const data = await response.json().then(data => data);

        //console.log(data);

        // Devuelve el pedido especificado
        return true
    } else return false;
}

const order = {
    add: addOrder,
    getAll: getAllOrders,
    get: getOrder,
    update: updateOrder,
}

export default order