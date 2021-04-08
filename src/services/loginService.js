import myCookie  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + '/api/login/login'

export const login = async ({user, pass}) => {

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
        await fetch(apiLocation, options)
            .then(response => response)

    // Devolvió 200, entonces debe ingresar
    if (response.statusText === "OK"){
        const data = await response.json().then(data => data);

        const result = {
            signedIn: true,
            user: {
                id: data.Id,
                name: 'Luciano Lapenna', //data.Name,
                token: data.Token
            }
        }

        // Guardamos la informacion satisfactoria en cookies
        myCookie.user.set(result.user)

        // Devuelve el objeto
        return result;
    }
    // Devolvió 401, no inicia
    else return {signedIn: false};
}