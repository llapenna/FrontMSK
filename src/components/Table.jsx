import { Fragment, useState, useEffect, createContext } from "react"

import { isInArr } from '../utils/functions'

import { AwesomeIcon, AwesomeSpinner } from './Awesome'

const FilterItem = ({filter, handleRemoveFilter}) => {
    return (
        <div 
            className="alert alert-success alert-dismissible fade show me-3"
            style={{display:"inline-block"}}
            role="alert">
            {filter.name}:  {filter.value}
            <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="alert" 
                aria-label="Close"
                onClick={ () => {handleRemoveFilter(filter.id);  }}>
            </button>
        </div>
    );
}

// Input group con los seteadores de filtros
const FilterField = ({filterColumns, handleAddFilter}) => {
    const defaultFilter = {
        id: -1,
        key: "null",
        name: "Seleccionar Filtro"
    }
    const nullFilter = {
        id: -1,
        key: "null",
        name: "No quedan filtros"
    }
    const [newFilter, setNewFilter] = useState(filterColumns.length === 1 ? filterColumns[0] : defaultFilter);


    const dropdownDisabled = filterColumns.length <= 1;
    const inputDisabled = filterColumns.length === 0;
    const isDisabled = false


    // Setea el nuevo filtro
    const handleNewFilter = filter => {
        setNewFilter(filter);
    }

    useEffect( () => {
        setNewFilter(filterColumns.length === 1 ? filterColumns[0] : defaultFilter);
    }, [filterColumns.length])

    return (
        <div className="row">
            <div className="col col-md-6">
                <div className="input-group input-group-sm mb-3">

                    { /* Boton que abre el dropdown */ }
                    {/* { fixedFilter 
                    ? <button
                        className={`btn btn-outline-secondary`}
                        type="button"
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        disabled={true}>
                            {newFilter.name}
                    </button>
                    : 
                    <button
                        className={`btn btn-outline-secondary ${dropdownDisabled ? "" : "dropdown-toggle"}`}
                        type="button"
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        disabled={dropdownDisabled}>
                            {newFilter.name}
                    </button>} */}

                {filterColumns.length > 1 
                ? <button
                    className="btn btn-outline-secondary dropdown-toggle" 
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    disabled={isDisabled}>
                    {newFilter.name}
                </button>
                : <button
                    className="btn btn-outline-secondary" 
                    type="button" 
                    disabled={true}>
                    {filterColumns.length === 0 ? nullFilter.name : newFilter.name}
                </button>}

                    { /* Dropdown para elegir filtro */ }
                    <ul className="dropdown-menu">
                        {/* Mapear columnas */}

                        { filterColumns.length > 0
                            ?   filterColumns.map( filter => 
                                <li 
                                    key={filter.id}
                                    className="dropdown-item"
                                    style={{cursor:'pointer'}}
                                    filterid={filter.id}
                                    filterkey={filter.key}
                                    onClick={() => handleNewFilter(filter)}>
                                    {filter.name}
                                </li>)
                            :   <li
                                    className="dropdown-item">
                                    No hay más filtros
                                </li>}
                    </ul>

                    { /* Introducir el valor del filtro */}
                    <input
                        type="text" 
                        className="form-control" 
                        aria-label="Valor del filtro"
                        placeholder="Valor del filtro..."
                        disabled={inputDisabled}>
                    </input>

                    { /* Aplica el nuevo filtro */ }
                    <button 
                        className="btn btn-outline-success" 
                        type="button"
                        onClick={e => {
                            const input = e.target.previousSibling;
                            const value = input.value;

                            // Verificamos que no sea el filtro por defecto, o que no haya un valor
                            if (newFilter.id !== -1 && value !== "") {

                                // Limpiamos inputs de filtro
                                input.value = ""

                                if (filterColumns.length === 1) {
                                    setNewFilter(nullFilter)
                                } else { //if (filterColumns.length === 1) {
                                    setNewFilter(filterColumns.filter( f => f.id === newFilter.id));
                                }
                            
                                // if (filterColumns.length > 1)
                                //     setNewFilter(defaultFilter);
                                // else setNewFilter()

                                // Aplicamos el filtro
                                handleAddFilter({value, ...newFilter});
                            }
                        }}
                        disabled={inputDisabled}>
                        Buscar
                    </button>
                </div>
            </div>
        </div>
        
    );
}

const Filters = ({filterColumns, handlers, filters}) => {
    return (
        <Fragment>
            <FilterField 
                filterColumns={filterColumns.filter( ({id}) => !isInArr(id, filters))}
                handleAddFilter={handlers.handleAddFilter}/>
            
            {/* Aca van los alerts con el filtro especificado  */}
            {filters.map( (filter) => 
                <FilterItem 
                    key={filter.id}
                    filter={filter}
                    handleRemoveFilter={handlers.handleRemoveFilter}/>)}
        </Fragment>
    );
}

const Table = ({ 
    tableColumns,
    filterColumns = tableColumns,
    customFilter = [], 
    handleGetData = null,
    handleSelectRow = null, 
    pagination = true,
    getOnFirstMount = false,
    excludeRow = [],
    theme = "green"}) => {
    
    const initial = {
        tableData: {
            data: [],
            maxPage: 0
        },
        filters: [],
        page: 1,
    }
    const [tableData, setTableData] = useState(initial.tableData)
    const [addedFilters, setFilter] = useState(initial.filters);

    const [loadingData, setLoadingData] = useState(false);

    const [page, setPage] = useState(1);

    const isSelectable = handleSelectRow !== null
        ? { onClick: e => handleOnClickRow(e.target) }
        : { }

    const getTableData = () => {
        setLoadingData(true);

        try {
            handleGetData({page, filters: addedFilters})
                .then(newData => {setTableData(newData); setLoadingData(false);});
        } catch (e) {
            console.error("No se pasó una funcion handler para obtener informacion para la tabla");

            // Seteamos un valor por defecto
            setTableData([]);
            setLoadingData(false);
        }
    }

    const handleAddFilter = newFilter => {
        setFilter([...addedFilters, newFilter]);
    }
    const handleRemoveFilter = removeId => {
        setFilter(addedFilters.filter( ({id}) => id !== removeId))
    }
    const handleOnClickRow = row => {

        // TODO: Investigar por que se pasa el td y no el tr
        try {
            handleSelectRow(row.parentElement);
        } catch (e) {
            console.log(e);
            //console.log("Se hizo click en la fila pero no se proveyó una función handler.")
        }
    }
    const handleSelectPage = page => {
        setPage(page);
    }

    // Obtener data de la API
    useEffect(() => {
        // Esto nos asegura que se pida la data, solo si se realizo una busqueda (nuevo filtro)
        // o si por defecto en el primer mount tiene que hacerlo
        if (getOnFirstMount || addedFilters.length > 0 || filterColumns === null) {
            getTableData();
        }    
    }, [addedFilters.length, page])

    return (
        <Fragment>

            { customFilter.map( filter => 
                    <FilterField
                        key={filter.id}
                        filterColumns={[filter].filter( ({id}) => !isInArr(id,addedFilters))}
                        handleAddFilter={handleAddFilter}/> )
            }

            {/* Se filtra por todas las columnas */}
            { filterColumns !== null &&
            <Filters 
                filterColumns={filterColumns}
                handlers={{handleAddFilter,handleRemoveFilter}}
                filters={addedFilters}/>}

            {/* Tabla */}
            <div className="table-responsive">
                <table className="table table-hover table-sm">
                    <thead className={`table-${theme}`}>
                        <tr>
                            {/* <th scope="col">#</th> */}

                            {/* Mapear columnas */}
                            { tableColumns.map( ({id, key, name}) => 
                                <th 
                                    key={id}
                                    scope="col"
                                    filterby={key}>
                                    {name}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Mapear cada fila */}

                        { loadingData
                        // Se esta obteniendo la data del server
                        ?   <tr style={{textAlign:"center"}}>
                                <td colSpan={tableColumns.length + 1}>
                                    <AwesomeSpinner />
                                </td>
                            </tr>
                        : tableData.data.length === 0 
                            ?   <tr style={{textAlign:"center"}}>
                                    <td colSpan={tableColumns.length + 1}>No hay información. Pruebe a ingresar un filtro para buscar.</td>
                                </tr>
                            :   tableData.data.map((row, i) => // Excluimos las filas especificadas
                                    !isInArr(row.Id, excludeRow) &&
                                    <tr 
                                        key={row.Id}
                                        dataid={row.Id}
                                        style={{ cursor: handleSelectRow !== null ? "pointer" : "default"}}
                                        {...isSelectable}>

                                        {/* Mapear cada celda */}
                                        { tableColumns.map( ({key, type}, i) => 
                                            <td 
                                                style={{
                                                    textAlign: type === "number" ? "right" : "left"}}
                                                key={key}
                                                datakey={key}>
                                                {type === "number" ? row[key].toFixed(2) : row[key]}
                                            </td>)}
                                    </tr>)}
                    </tbody>
                </table>
            </div>

            {/* Paginacion */}

            {/*  TODO: Cuidado con lo responsive al usar rows: revisar */}
            {(pagination && tableData.maxPage > 1) && <div className="row">

                { tableData.maxPage !== 0 && 
                    <Pagination 
                        page={page} 
                        maxPage={tableData.maxPage}
                        handleSelectPage={handleSelectPage}/> }
                
                {/* <div className="col col-sm-auto align-self-end">
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            10 filas
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li className="dropdown-item">20 filas</li>
                            <li className="dropdown-item">30 filas</li>
                            <li className="dropdown-item">50 filas</li>
                        </ul>
                    </div>
                </div> */}
            </div>}
            
        </Fragment>
    );
}

// <TODO> Mejorar esta seccion </TODO>
const Pagination = ({page, maxPage, handleSelectPage}) => {

    const handleNextPage = () => {
        handleSelectPage(page + 1);
    }
    const handleLastPage = () => {
        handleSelectPage(maxPage);
    }
    const handlePreviousPage = () => {
        handleSelectPage(page - 1)
    }
    const handleFirstPage = () => {
        handleSelectPage(1);
    }
    
    return (
        <div className="col align-self-start">
            <div className="input-group input-group-sm mt-3">
                {/* Izquierda */}
                {page !== 1 && 
                <Fragment>
                    <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={handlePreviousPage}>
                        <AwesomeIcon icon="angle-left"/>
                    </button>
                </Fragment>}

                {/* Primera pagina */}
                { page !== 1 && 
                <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={handleFirstPage}>
                    {1}
                </button>}

                {/* Dots */}
                {page > 2 && 
                <button 
                    className="btn btn-outline-secondary btn-secondary-nohover" 
                    type="button">
                    ...
                </button>}
                

                {/* Pagina actual */}
                <button 
                    className="btn btn-success" 
                    type="button">
                    {page}
                </button>

                {/* Dots */}
                {maxPage - page > 1 && 
                <button 
                    className="btn btn-outline-secondary btn-secondary-nohover" 
                    type="button">
                    ...
                </button>}

                {/* Ultima pagina */}
                { page !== maxPage && 
                <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={handleLastPage}>
                    {maxPage}
                </button>}

                

                {/* Derecha */}
                {page !== maxPage && 
                <Fragment>
                    <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={handleNextPage}>
                        <AwesomeIcon icon="angle-right"/>
                    </button>
                </Fragment>}
                
            </div>
        </div>
    )
}

// const filterData = {
//     page: 1,
//     resultsPerPage: 30,
//     filters: [
//         { key: "codigo", value: "AR2000" },
//         { key: "precio", value: "1000" },
//     ],
//     token: { tokenObj } // objeto token
// }


export default Table;