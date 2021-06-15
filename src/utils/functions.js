import myCookies from '../services/cookiesService'

export const isInArr = (id, arr) => {

    return arr.findIndex( e => id == e.id) !== -1;
}

export const round = (number, decimals) => Math.Round(number * 100) / 100

export const removeFromArray = (array, id) => {
    return array.filter( e => e.id !== id )  
}

export const findAttributeOf = (row, attr) => {
    
    try {
        const element = row.querySelector(`td[datakey=${attr}]`);

        return element.innerText;
    } catch (e) {
        console.error(`No se encontró una celda con la propiedad ${attr}`);

        return "";
    }
}

export const failed = response => {
    return response?.error !== undefined
}
export const succeed = response => {
    return response?.error === undefined
}

export const options = body => {
    return {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...body,
            token: myCookies.user.get()?.token
        })
    }
}