import { apiHost } from '../utils/const'

import myCookies from "./cookiesService"

const apiLocation = apiHost + 'module'

export const getModules = async ({id, token}) => {

    const method = 'getmodules';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, token})
    }

    const response = 
        await fetch(`${apiLocation}/${method}/`, options)
            .then(response => response);

    if (response.status === 200) {

        // Actualizamos el tiempo de las cookies
        myCookies.user.update();

        const data = 
            await response.json()
                .then(data => data);

        // Agrupa por seccion
        const aux = data.reduce(function (r, a) {
            r[a.Section] = r[a.Section] || [];
            r[a.Section].push(a);
            return r;
        }, Object.create(null));

        const result = [];

        // Convierte cada seccion en un elemento de un array
        for (let key of Object.keys(aux)) {
            result.push({[key]: aux[key], keyName:key})
        }

        return result;
    }
    // Devolvemos un array vacio === no informacion
    else return []
}