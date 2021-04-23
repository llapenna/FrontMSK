import {useState, useEffect } from 'react'

export const useTableData = (page, filters, getData, forceGet = false) => {
    const [tableData, setTableData] = useState({data: [], maxPage: 0})
    const [loadingData, setLoadingData] = useState(false)

    useEffect( () => {
        if (forceGet || filters.length > 0) {
            setLoadingData(true);

            // Intentamos obtener la informacion
            try {
                getData({page, filters})
                    .then( newData => {
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

    return [tableData, loadingData]
}