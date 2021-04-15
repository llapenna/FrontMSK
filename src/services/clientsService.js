import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'customer/'

export const findAttributeOf = (row, attr) => {
    try {
        const element = row.querySelector(`td[datakey=${attr}]`);

        return element.innerText;
    } catch (e) {
        console.error(`No se encontró una celda con la propiedad ${attr}`);

        return "";
    }
}

export const getClients = async ({page=1, filters=[]}) => {

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
        await fetch(apiLocation + method, options)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.statusText === "OK") {
        
        // Actualizamos el tiempo de las cookies
        myCookies.user.update();
        const data = await response.json().then(data => data);

        // Devuelve la lista de clientes
        return {maxPage: data.MaxPages, data:data.CustomerList};
    }
    // Devolvió 401, no devuelve data
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

export const addClient = async (client
    // {name, cuit, customerType,
    // activity, phone, address,
    // city, zipcode, zone,
    // seller, branch, iva,
    // route}
) => {
    const method = ''

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(apiLocation + method, options)
            .then(response => response)

    // Devolvió 200, se creó el cliente
    if (response.statusText === "OK") {
        myCookies.user.update();

        return true
    } else return false;

    // En caso de que devolviese info adicional:

    // if (response.statusText === "OK"){
    //     const data = await response.json().then(data => data);

    //     // Devuelve la lista de clientes
    //     return {maxPage: data.MaxPages, data:data.CustomerList};
    // }
    // // Devolvió 401, no inicia
    // else return [];
}


const client = {
    add: addClient,
    get: getClients
}

export default client