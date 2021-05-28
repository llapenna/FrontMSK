import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const service = 'login'

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
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, entonces debe ingresar
    if (response.status === 200){
        const data = await response.json().then(data => data);

        const isCustomer = data.IdCustomer !== 0

        const result = {
            signedIn: true,
            user: {
                id: data.Id,
                name: data.User,
                token: data.Token,
                isCustomer,
                customerInfo: isCustomer 
                    ? {
                        id: data.Customer.Id,
                        balance: data.Customer.Balance,
                        name: data.Customer.Name,
                    }
                    : {},
            },
        }

        // Devuelve el objeto
        return result;
    }
    // Devolvió otra cosa, no inicia
    else return {
        signedIn: false, 
        error: response.status === 401 ? "Credenciales incorrectas." : "Ocurrió un error, intente más tarde."
    };
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
        await fetch(`${apiHost}/${service}/${method}/`, options)
                .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.status === 200){

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update();

        const data = await response.json().then(data => data);

        // Devuelve la lista de usuarios
        return {maxPage: data.MaxPages, rows:data.LoginList};
    }
    // Devolvió 401, no devuelve nada
    else return [];
}

export const addUser = async ({user, pass, email, phone, roles, name, customerid, sellerid}) => {
    const method = 'insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            User: user,
            Pass: pass,
            Mail: email,
            Phone: phone,
            Roles: roles,
            Name: name,
            // ID por si el usuario es cliente
            IdCustomer: customerid,
            // ID por si el usuario es vendedor
            Seller: sellerid,
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

const user = {
    add: addUser,
    get: (filters=[]) => getUsers(filters),
}

export default user