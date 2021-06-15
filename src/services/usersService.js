import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'
import { options, failed } from '../utils/functions'

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


const getAllUsers = async filters => {
    const method = 'getAll';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

        // Devuelve la lista de usuarios
        return {maxPage: data.MaxPages, rows:data.LoginList};
    }
    // Devolvió 401, no devuelve nada
    else return [];
}
const getUser = id => {
    
    const method = 'getById'

    const body = { id }

    return fetch(`${apiHost}/${service}/${method}/`, options(body))
        .then( r => {

            return r.status === 200
                // Obtuvimos informacion
                ? r.json()
                // Hubo algun error
                : { error: r.status}
        })
        .then ( data => {

            console.log('GetUser', data)
            
            // Mapeamos la informacion
            if (data?.error === undefined) 
                return {
                    id: data.Id,
                    user: data.User,
                    pass: '',
                    email: data.Mail,
                    phone: data.Phone,
                    role: {
                        id: data.Roles[0].Id,
                        name: data.Roles[0].Name,
                        text: data.Roles[0].Name,
                    }
                }
            else return {error: 'Ocurrió un error desconocido.'}
        })
}

const addUser = ({user, pass, email, phone, roles, name = user, customerid = 0, sellerid = 0}) => {
    const method = 'insert'

    const body = {
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
        token: myCookies.user.get()?.token
    }

    return fetch(`${apiHost}/${service}/${method}/`, options(body))
        .then( r => {
            return r.status === 201 // CREATED
            ? r.json()
            : { error: r.status}
        })
        .then( d => {
            if (!failed(d))
                return true
            else if (d.error === 401)
                return {error: 'Finalizó el tiempo de la sesión, vuelva a loguearse para continuar.'}
            else if (d.error === 409) // CONFLICT
                return {error: 'Ya existe otro usuario con este username. Elija otro para continuar.'}
            else if (d.error === 500)
                return {error: 'Ha ocurrido un error inesperado en el servidor, contacte al soporte.'}
        })

    // // Obtenemos la respuesta para verificar el status code
    // const response = 
    //     await fetch(`${apiHost}/${service}/${method}/`, options)
    //         .then(response => response)

    // // Devolvió 200, se creó el usuario
    // if (response.status === 200) {
    //     // Actualizamos el vencimiento de la cookie
    //     myCookies.user.update();

    //     return true;
    // }
    // else return false
}

const deleteUser = id => {
    const method = 'Suspend'

    const body = { id }

    return fetch(`${apiHost}/${service}/${method}/`, options(body))
        .then( r => {

            return r.status === 200
                // Obtuvimos informacion
                ? r.json()
                // Hubo algun error
                : { error: r.status}
        })
        .then ( data => {
            
            // Se eliminó el usuario
            if (data?.error === undefined) 
                return true
            else if (data.error === 401)
                return {error: 'Se ha terminado el tiempode la sesión, vuelva a iniciar para contiunar.'}
            else if (data.error === 500)
                return {error: 'Ha ocurrido un error inesperado en el servidor, contacte al soporte.'}
            else return {error: 'Ocurrión un error desconocido.'}
        })
}

const updateUser = ({id, user, pass, email, phone, roles, customerid = 0, sellerid = 0}) => {

    const method = 'update'

    const body = {
        Id: id,
        User: user,
        Pass: pass,
        Mail: email,
        Phone: phone,
        Roles: roles,
        // ID por si el usuario es cliente
        IdCustomer: customerid,
        // ID por si el usuario es vendedor
        Seller: sellerid,
    }

    return fetch(`${apiHost}/${service}/${method}/`, options(body))
        .then( r => {
            return r.status === 200
                // Obtuvimos informacion
                ? r.json()
                // Hubo algun error
                : { error: r.status}
        })
        .then( r => {

            // Se modifico el usuario
            if (r?.error === undefined) 
                return true
            else if (r.error === 401)
                return {error: 'Se ha terminado el tiempode la sesión, vuelva a iniciar para contiunar.'}
            else if (r.error === 500)
                return {error: 'Ha ocurrido un error inesperado en el servidor, contacte al soporte.'}
            else return {error: 'Ocurrión un error desconocido.'}
        })
}

const user = {
    add: addUser,
    getAll: (filters=[]) => getAllUsers(filters),
    get: getUser,
    delete: deleteUser,
    update: updateUser,
}

export default user




// fetch('https://mskpedidos.com/api/api/login/login', {
//     method:'POST',
//     mode: 'cors',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//         user: "SofiaCarassai", 
//         pass: "msk123456"
//     })
// }).then(r => { 
//     if (r.status === 200) 
//         throw new Error('my error')
// }).catch( e => console.log('errored'))