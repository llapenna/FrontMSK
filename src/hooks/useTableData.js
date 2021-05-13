import {useState, useEffect } from 'react'

export const useTableData = (page, filters, getData, forceGet = false) => {
    const initial = {
        rows: [],
        maxPage: 0,
    }
    const [tableData, setTableData] = useState(initial)
    const [isLoadingData, setLoadingData] = useState(false)

    console.log('called')

    useEffect( () => {
        let isMounted = true;

        if (forceGet || filters.length > 0) {
            setLoadingData(true);

            // Intentamos obtener la informacion
            try {
                getData({page, filters})
                    .then( newData => {
                        console.log('Fetched', newData);

                        if (isMounted) {
                            setLoadingData(false);
                            newData === null ? setTableData(initial) : setTableData(newData);
                        }
                    })
                    .catch( e =>{
                        setTableData(initial);
                        setLoadingData(false);
                    })
            } catch (e) {
                console.error("No se pasó una funcion handler para obtener informacion para la tabla");

                // Seteamos un valor por defecto
                setTableData(initial);
                setLoadingData(false);
            }
        }

        // Cleanup Function
        return () => { isMounted = false }

    }, [filters.length, page])

    return [tableData, isLoadingData]
}