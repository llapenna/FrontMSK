import {useState, useEffect } from 'react'

export const useTableData = (page, filters, getData, forceGet = false) => {
    const [tableData, setTableData] = useState({rows: [], maxPage: 0})
    const [isLoadingData, setLoadingData] = useState(false)

    useEffect( () => {
        if (forceGet || filters.length > 0) {
            setLoadingData(true);

            // Intentamos obtener la informacion
            try {
                getData({page, filters/*: filters.filter( f => f.id !== -1)*/})
                    .then( newData => {
                        console.log('Fetched', newData);
                        newData === null ? setTableData([]) : setTableData(newData);
                        setLoadingData(false);
                    })
            } catch (e) {
                console.error("No se pasó una funcion handler para obtener informacion para la tabla");

                // Seteamos un valor por defecto
                setTableData([]);
                setLoadingData(false);
            }
        }
    }, [filters.length, page])

    return [tableData, isLoadingData]
}