const useTableData = (page, filters, getData, force = false) => {
    const [tableData, setTableData] = useState([])
    const [loadingData, setLoadingData] = useState(false)

    useEffect( () => {
        if (force || filters.length > 0)
        {
            setLoadingData(true);

            // Intentamos obtener la informacion
            try {
                getData({page, filters})
                    .then( newData => {
                        newData === null ? setTableData([]) : setTableData(newData)})
            } catch (e) {
                console.error("No se pasó una funcion handler para obtener informacion para la tabla");

                // Seteamos un valor por defecto
                setTableData([]);
            }

            setLoadingData(false);
        }
    }, [])



    return {tableData}
}