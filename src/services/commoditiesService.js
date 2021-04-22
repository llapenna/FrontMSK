import { apiHost } from '../utils/const'

import myCookies from "./cookiesService"

const apiLocation = apiHost + 'commodity/'

export const getCommodities = async ({page=1, filters=[]}) => {

    const method = 'getList/';

    const defaultResultsPerPage = 10;

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            resultsPerPage: defaultResultsPerPage,
            filters,
            token: myCookies.user.get().token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(apiLocation + method, options)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.status == 200){

        // Actualizamos el tiempo de las cookies
        myCookies.user.update();
        
        const data = await response.json().then(data => data !== null ? data : {
            maxPage: 1,
            CommodityList: []
        });

        console.log(data);

        const random = (min, max) => Math.random() * (max - min) + min

        // Devuelve la lista de productos
        return {
            maxPage: data.MaxPages, 
            data: data.CommodityList.map( commoditie => {
                return {
                    ...commoditie,
                    Stock: Math.round(random(1,100)), 
                    Precio: Math.round(random(1,1000) * 100) / 100
                }
            })
        };
    }
    // Devolvió 401, no devuelve nada
    else return [];
}