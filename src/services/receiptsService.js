import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'login'

const getAllReceipts = async () => {

    const method = ''

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: { token: myCookies.user.get().token }
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
                .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.status === 200){

        // Actualizamos el vencimiento de la cookie
        myCookies.user.update()

        const data = await response.json().then(data => data)

        // Devuelve la lista
        return []
    }
    // Devolvió 401, no devuelve nada
    else return []
}

const receipt = {
    getAll: getAllReceipts,
}

export default receipt