import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const service = 'customer'

const getCustomers = async ({page=1, filters=[]}) => {

    const defaultResultsPerPage = 10;
    const method = "getList";

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
    if (response.status === 200) {
        
        // Actualizamos el tiempo de las cookies
        myCookies.user.update();
        const data = await response.json().then(data => data);

        // Devuelve la lista de clientes
        return {maxPage: data.MaxPages, rows:data.CustomerList};
    }
    // Devolvió 401, no devuelve data
    else return {rows:[]};
}

const getAllCustomers = async() => {

    const method = "/getall"

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)


    // Devolvió 200, entonces debe obtener los datos
    if (response.status === 200){
        const data = await response.json().then(data => data);

        // Devuelve la lista de clientes
        return data.slice(0,11);
    }
    // Devolvió 401, no inicia
    else return [];
}

const addCustomer = async client => {
    const method = 'insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...client,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, se creó el cliente
    if (response.status === 200) {
        myCookies.user.update();

        return true
    } else return false;
}


const customer = {
    add: addCustomer,
    get: getCustomers
}

export default customer