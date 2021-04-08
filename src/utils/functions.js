export const isInArr = (myId, arr) => {
    return arr.findIndex( ({id}) => myId === id) !== -1;
}