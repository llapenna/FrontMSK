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
const FilterFields = ({filterColumns = [], handleAddFilter}) => {
    const defaultFilter = {
        id: -1,
        key: "null",
        name: "Seleccionar Filtro"
    }
    const [newFilter, setNewFilter] = useState(defaultFilter);

    // Setea el nuevo filtro
    const handleNewFilter = filter => {
        setNewFilter(filter);
    }

    const isDisabled = false//filterColumns.length > 0 ? "" : "disabled";

    return (
        <div className="input-group input-group-sm mb-3">

            { /* Boton que abre el dropdown */ }
            {filterColumns.length !== 1 
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
                    {filterColumns[0].name}
                </button>}

            { /* Dropdown para elegir filtro */ }
            <ul className="dropdown-menu">
                {/* Mapear columnas */}

                { filterColumns.length > 0
                    ?   filterColumns.map( (filter, i) => 
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

            { /* Aplica el nuevo filtro */ }
            <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={e => {
                    //const val = document.getElementById("filterInput").value;
                    const val = e.target.nextSibling.value

                    if (newFilter.id !== -1 && val !== "") {

                        // Limpiamos inputs de filtro
                        document.getElementById("filterInput").value = ""
                        setNewFilter(defaultFilter);

                        // Aplicamos el filtro
                        handleAddFilter({value: val, ...newFilter});
                    }
                }}
                disabled={isDisabled}>
                Buscar
            </button>

            { /* Introducir el valor del filtro */}
            <input
                id="filterInput"
                type="text" 
                className="form-control" 
                aria-label="Valor del filtro"
                placeholder="Valor del filtro..."
                disabled={isDisabled}>
            </input>
        </div>
    );
}

const Filters = ({filterColumns, handlers, filters}) => {
    return (
        <Fragment>
            <FilterFields 
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
    handleGetData = null,
    handleSelectRow = null, 
    pagination = true,
    getOnFirstMount = false,
    excludeRow = [] }) => {
    
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
        if (getOnFirstMount || addedFilters.length > 0) {
            getTableData();
        }    
    }, [addedFilters.length, page])

    return (
        <Fragment>

            {/* Se filtra por todas las columnas */}
            <Filters 
                filterColumns={filterColumns}
                handlers={{handleAddFilter,handleRemoveFilter}}
                filters={addedFilters}/>

            {/* Tabla */}
            <div className="table-responsive">
                <table className="table table-hover table-sm">
                    <thead className="table-green">
                        <tr>
                            <th scope="col">#</th>

                            {/* Maper columnas */}
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
                        { tableData.data.length === 0

                        // Tabla vacia
                        ? <tr style={{textAlign:"center"}}>
                            <td colSpan={tableColumns.length + 1}>Ingrese un filtro para buscar</td>
                          </tr>
                          
                        // Tabla siendo mapeada
                        : loadingData 
                            // Se esta obteniendo la data del server
                            ?   <tr style={{textAlign:"center"}}>
                                    <td colSpan={tableColumns.length + 1}>
                                        <AwesomeSpinner icon="spinner"/>
                                    </td>
                                </tr>
                            // Ya se obtuvo, mapear
                            : tableData.data.map((row, i) =>
                                // Excluimos las filas especificadas
                                !isInArr(row.Id, excludeRow) &&
                                <tr 
                                    key={row.Id}
                                    dataid={row.Id}
                                    style={{ cursor: handleSelectRow !== null ? "pointer" : "default"}}
                                    {...isSelectable}>

                                    <td>{i + 1}</td>

                                    {/* Mapear cada celda */}
                                    { tableColumns.map( ({key}, i) => 
                                        <td 
                                            style={{
                                                textAlign: typeof row[key] === "number" ? "right" : "left"}}
                                            key={key}
                                            datakey={key}>
                                            {typeof row[key] === "number" ? row[key].toFixed(2) : row[key]}
                                        </td>)}
                                </tr>
                        )}
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
                    {/* <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={handleFirstPage}>
                        <AwesomeIcon icon="angle-double-left"/>
                    </button> */}
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
                    {/* <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={handleLastPage}>
                        <AwesomeIcon icon="angle-double-right"/>
                    </button> */}
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