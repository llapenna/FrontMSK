export const isInArr = (id, arr) => {

    return arr.findIndex( e => id == e.id) !== -1;
}

export const round = (number, decimals) => Math.Round(number * 100) / 100

export const removeFromArray = (array, id) => {
    return array.filter( e => e.id !== id )  
}

export const findAttributeOf = (row, attr) => {
    //console.log(row, attr)
    try {
        const element = row.querySelector(`td[datakey=${attr}]`);

        return element.innerText;
    } catch (e) {
        console.error(`No se encontró una celda con la propiedad ${attr}`);

        return "";
    }
}