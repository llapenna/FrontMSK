// {
//     Name:
//     CUIT:
//     User:
//     Pass:
//     Mail:
//     Phone:
// }

import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'
import { options, succeed } from '../utils/functions'

const service = 'company'


const addCompany = ({name, cuit, user, pass, email, phone}) => {
    
    const method = 'Insert'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Login: {
                User: user,
                Pass: pass,
                Mail: email,
                Phone: phone,
            },
            CUIT: cuit,
            Name: name,
            token: myCookies.user.get()?.token
        })
    }
    
    return fetch(`${apiHost}/${service}/${method}/`, options)
        .then( r => {
            // Se creo la empresa
            if(r.status === 200) {
                myCookies.user.update();
                return { r: true};
            }
            else return {r: false, error: 'Hubo un error al agregar la empresa, inténtelo más tarde.'};
        })
}

const getCompany = id => {
    const method = 'getByid'

    const body = { id }

    return fetch(`${apiHost}/${service}/${method}/`, options(body))
        .then( r => {
            return r.status === 200
            ? r.json()
            : { error: r.status }
        })
        .then( d => {
            if (succeed(d))
                return {
                    id: d.Id,
                    cuit: d.CUIT,
                    name: d.Name,
                    user: {
                        id: d.Users[0].Id,
                        user: d.Users[0].User,
                        pass: d.Users[0].Pass,
                        phone: d.Users[0].Phone,
                        email: d.Users[0].Mail,
                    }
                }
            else if (d.error === 401)
                return {error: 'Finalizó el tiempo de la sesión, vuelva a loguearse para continuar.'}
            else if (d.error === 500)
                return {error: 'Ha ocurrido un error inesperado en el servidor, contacte al soporte.'}
            else
                return {error: 'Ha ocurrido un error desconocido.'}
        })
}

const getAllCompanies = () => {
    const method = 'GetAll'

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: myCookies.user.get()?.token
        })
    }

    return fetch(`${apiHost}/${service}/${method}/`, options)
        .then( r => {
            // Obtuvimos informacion
            if (r.status === 200) return r.json()

            // Hubo un problema, no obtuvimos informacion
            else return {error: r.status}
        })
        .then( data => {

            // Chequea si hubo algun error
            if (data?.error !== undefined) {
                // Filtra por los distintos tipos de error

            }
            // Tratamos/mapeamos la informacion
            else return {
                maxPage: 0,
                rows: data.map( c => { return {
                    Id: c.Id,
                    cuit: c.CUIT,
                    name: c.Name,
                    user: c.Users[0].User,
                    pass: c.Users[0].Pass,
                }})
            }
        })
}

const company = {
    add: addCompany,
    getAll: getAllCompanies,
    get: getCompany,
}

export default company;