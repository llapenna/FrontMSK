// Core 
import { Fragment, useState, useEffect, createContext } from 'react'

// Hooks
import { useTableData } from '../../hooks/useTableData'

// Componentss
import Filters from './Filters'
import { AwesomeIcon, AwesomeSpinner } from '../Awesome'

// Other functions
import { isInArr } from '../../utils/functions'

export const TableContext = createContext();

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

const TableHeader = () => {
    return (
        <TableContext.Consumer>
            { state => 
            <thead className={`table-${state.theme}`}>
                <tr>

                    {/* Mapear columnas */}
                    { state.columns.map( ({id, key, name}) => 
                        <th 
                            key={id}
                            scope="col"
                            filterby={key}>
                            {name}
                        </th>
                    )}
                </tr>
            </thead>
            }
        </TableContext.Consumer>
    );
}


const TableRows = ({excludeRow, handleSelect}) => {

    const handleOnClickRow = row => {
        // TODO: Investigar por que se pasa el td y no el tr
        try {
            handleSelect(row.parentElement);
        } catch (e) {
            console.log("Se hizo click en la fila pero no se proveyó una función handler.", e)
        }
    }

    const isSelectable = handleSelect !== undefined
        ? { onClick: e => handleOnClickRow(e.target) }
        : { }

    return (
        <TableContext.Consumer>
            { state =>

            state.data.rows.map( row => 
            
                !isInArr(row.Id, excludeRow) &&
                <tr 
                    key={row.Id}
                    dataid={row.Id}
                    style={{ cursor: handleSelect !== undefined ? "pointer" : "default"}}
                    {...isSelectable}>

                    {/* Mapear cada celda */}
                    { state.columns.map( ({key, type}) => 
                        <td 
                            style={{
                                textAlign: type === "number" ? "right" : "left"}}
                            key={key}
                            datakey={key}>
                            {type === "number" ? row[key].toFixed(2) : row[key]}
                        </td>)}
                </tr>
            )}
        </TableContext.Consumer>
    );
}

const TableBody = ({isLoadingData, excludeRow, handleSelect}) => {

    return (
        <TableContext.Consumer>
            { state =>
            <tbody>

                {/* Mapear cada fila */}

                {  isLoadingData 
                ? // Todavia se estan obteniendo los datos
                    <tr style={{textAlign:"center"}}>
                        <td colSpan={state.columns.length}>
                            <AwesomeSpinner />
                        </td>
                    </tr>
                : // Hubo respuesta del servidor
                    state.data.rows.length === 0
                    ? // No se encontró información del servidor
                        <tr style={{textAlign:"center"}}>
                            <td colSpan={state.columns.length}>
                                No hay información. Pruebe a ingresar un filtro para buscar.
                            </td>
                        </tr>
                    : // Se encontró información, mostrarla
                        <TableRows 
                            excludeRow={excludeRow} 
                            handleSelect={handleSelect}/>
                }
            </tbody>
            }
        </TableContext.Consumer>
    );    
}

const Table = ({ 
    columns,
    filterBy = columns,
    customFilter = [], 
    handleGetData = null,
    handleSelectRow, 
    pagination = true,
    getOnFirstMount = false,
    excludeRow = [],
    theme = "green"}) => {

    const [addedFilters, setFilter] = useState([]);
    const [page, setPage] = useState(1);

    const [tableData, loadingData] = 
        useTableData(page, addedFilters, handleGetData, getOnFirstMount || filterBy === null)

    const handleAddFilter = newFilter => {
        setFilter([...addedFilters, ...newFilter]);
    }
    const handleRemoveFilter = id => {
        setFilter(addedFilters.filter( f => f.id !== id))
    }
    const handleSelectPage = page => {
        setPage(page);
    }

    return (
        <TableContext.Provider value={{
            columns,
            filterBy,
            customFilter,
            data: tableData,
            filters: addedFilters,
            handlers: {
                addFilter: handleAddFilter,
                removeFilter: handleRemoveFilter,
            },
            page,
            theme
        }}>
            <Fragment>

                <Filters />

                {/* Tabla */}
                <div className="table-responsive">
                    <table className="table table-hover table-sm">

                        <TableHeader />

                        <TableBody
                            isLoadingData={loadingData}
                            excludeRow={excludeRow}
                            handleSelect={handleSelectRow}/>
    
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
        </TableContext.Provider>
    );
}

export default Table;