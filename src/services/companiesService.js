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

const service = 'companies'


export const addCompany = ({name, cuit, user, pass, email, phone}) => {
    
    const method = 'AddCompany'

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
            CUIT: cuit,
            Name: name,
            token: myCookies.user.get().token
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

//export const getCompanies

const company = {
    add: addCompany,
}

export default company;