import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + '/api/customer'

export const getClients = async ({page, filters=[]}) => {

    const defaultResultsPerPage = 10;
    const method = "/getList";

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
        const data = await response.json().then(data => data);

        // Devuelve la lista de clientes
        return {maxPage: data.MaxPages, data:data.CustomerList};
    }
    // Devolvió 401, no inicia
    else return [];
}

export const getAllClients = async() => {

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
        await fetch(apiLocation + method, options)
            .then(response => response)


    // Devolvió 200, entonces debe obtener los datos
    if (response.statusText === "OK"){
        const data = await response.json().then(data => data);

        console.log(data);

        // Devuelve la lista de clientes
        return data.slice(0,11);
    }
    // Devolvió 401, no inicia
    else return [];
}

export const addClient = async() => {
    
}