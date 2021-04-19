import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'login'

export const login = async ({user, pass}) => {

    const method = 'login'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({user, pass})
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, entonces debe ingresar
    if (response.statusText === "OK"){
        const data = await response.json().then(data => data);

        const result = {
            signedIn: true,
            user: {
                id: data.Id,
                name: data.User, //data.Name,
                token: data.Token
            }
        }

        // Devuelve el objeto
        return result;
    }
    // Devolvió 401, no inicia
    else return {signedIn: false};
}


export const getUsers = async filters => {
    const method = 'getAll';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filters,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
                .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.statusText === "OK"){

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        const data = await response.json().then(data => data);

        console.log(data);

        // Devuelve la lista de usuarios
        return {maxPage: data.MaxPages, data:data.LoginList};
    }
    // Devolvió 401, no devuelve nada
    else return [];
}

export const addUser = async user => {
    const method = 'insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...user,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
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

const user = {
    add: addUser,
    get: (filters=[]) => getUsers(filters),
}

export default user