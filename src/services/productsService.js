import { apiHost } from '../utils/const'
//const apiLocation = apiHost + ''

const apiLocation = './json/products.json'

export const getProducts = async () => {
    const custOptions = {
        method: 'GET'
    }

    // const options = {
    //     method: 'POST',
    //     mode: "cors",
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({id, token})
    // }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(apiLocation, custOptions)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.statusText === "OK"){
        const data = await response.json().then(data => data);

        // Devuelve la lista de productos
        return {maxPage: 1, data};
    }
    // Devolvió 401, no inicia
    else return [];
}