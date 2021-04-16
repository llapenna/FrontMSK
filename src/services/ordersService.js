import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'order/'

export const getOrders = async ({page=1, filters=[]}) => {

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
        await fetch(apiLocation + method, options)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.statusText === "OK"){

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        const data = await response.json().then(data => data);

        console.log(data);

        // Devuelve la lista de usuarios
        return {
            maxPage: 1, 
            data: data.map( row => {return {
                ...row,
                // Formatea la fecha
                Date: new Date(row.Date).toLocaleString()
            }})
        };
    }
    // Devolvió 401, no devuelve nada
    else return [];
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
        await fetch(apiLocation + method, options)
            .then(response => response)

    // Devolvió 200, se creó el cliente
    if (response.statusText === "OK") {
        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        return true;
    }
    else return false

    // En caso de que devolviese info adicional:

    // if (response.statusText === "OK"){
    //     const data = await response.json().then(data => data);

    //     // Devuelve la lista de clientes
    //     return {maxPage: data.MaxPages, data:data.CustomerList};
    // }
    // // Devolvió 401, no inicia
    // else return [];
}

const order = {
    add: addOrder,
    get: getOrders
}

export default order