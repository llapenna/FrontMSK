export const isInArr = (id, arr) => {
    return arr.findIndex( e => id == e.id) !== -1;
}

export const round = (number, decimals) => Math.Round(number * 100) / 100

export const removeFromArray = (array, id) => {
    return array.filter( e => e.id !== id )  
}