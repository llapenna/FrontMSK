import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const service = 'receipt'

const getAllReceipts = async () => {

    const method = 'GetAll'

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

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update()

        const data = await response.json().then(data => data)

        // Devuelve la lista
        return data.map( r => { return {
            id: r.Id,
            text: r.Name,
            // Eliminamos los espacios del nombre
            name: r.Name.replace(/\s+/g, ''),
        }})
    }
    // Devolvió 401, no devuelve nada
    else return []
}

const receipt = {
    getAll: getAllReceipts,
}

export default receipt