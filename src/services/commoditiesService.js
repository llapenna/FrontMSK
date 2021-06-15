import { apiHost } from '../utils/const'

import myCookies from "./cookiesService"

const service = 'commodity'

const getCommodities = async ({page=1, filters=[]}) => {

    const method = 'getList';

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
            token: myCookies.user.get()?.token
        })
    }

    // Obtenemos la respuesta para verificar el status code
    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
            .then(response => response)

    // Devolvió 200, entonces debe obtener los datos
    if (response.status === 200){

        // Actualizamos el tiempo de las cookies
        myCookies.user.update();
        
        const data = await response.json().then(data => data !== null ? data : {
            maxPage: 1,
            rows: []
        });

        // Devuelve la lista de productos
        return {
            maxPage: data.MaxPages, 
            rows: data.CommodityList.map( c => { return {
                Id: c.Id,
                code: c.InternalCode,
                name: c.Name,
                unit: c.UnitOfMeasurement,
                price: c.Price,
                avgWeight: c.AverageWeight,
            }}),
        };
    }
    //TODO: Optmizar para saber qué devuelve, y que devuelva un {maxPage: 0, rows: []} en caso de error
    // Devolvió 401, no devuelve nada
    else return {maxPage: 1, rows: []};
}

const commodity = {
    get: getCommodities,
}

export default commodity;