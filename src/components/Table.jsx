import { Fragment, useState, useEffect } from "react"

import { isInArr } from '../utils/functions'

import { AwesomeIcon } from './Awesome'

// const FilterSubmit = ({filters, newFilter, handleSetNewFilter, handleAddFilterBy}) => {
//     return (
//         <div className="input-group">
//                 { /* Sets the new filter to be applied */ }
//                 <button 
//                     className="btn-outline-secondary" 
//                     type="button"
//                     onClick={ (e) => handleAddFilterBy(e.target) }>
//                     Aplicar
//                 </button>

//                 { /* Button to open the dropdown */ }
//                 <button 
//                     className="btn-outline-secondary dropdown-toggle" 
//                     type="button" 
//                     data-bs-toggle="dropdown" 
//                     aria-expanded="false"
//                     filterid={newFilter.id} >
//                     {newFilter.property}
//                 </button>

                // { /* Dropdown to choose the filter */ }
                // <ul className="dropdown-menu">
                //     { filters.map( ({property, text, id}, i) => 
                //     <li 
                //         key={i}
                //         filterid={i}
                //         onClick={(e) => handleSetNewFilter(e.target) }
                //         className="dropdown-item"
                //         style={{cursor:"pointer"}}>
                //         {text}
                //     </li>)}
                // </ul>

                // { /* Set the value of the filter */}
                // <input 
                //     type="text" 
                //     className="form-control" 
                //     aria-label="Text input with dropdown button">
                // </input>
            // </div>
//     );
// }



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
                onClick={ () => handleRemoveFilter(filter.id)}>
            </button>
        </div>
    );
}

// Input group con los seteadores de filtros
const FilterFields = ({columnsToFilter, handleAddFilter}) => {
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

    return (
        <div className="input-group input-group-sm mb-3">

            { /* Boton que abre el dropdown */ }
            <button 
                className="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false">
                {newFilter.name}
            </button>

            { /* Dropdown para elegir filtro */ }
            <ul className="dropdown-menu">
                {/* Mapear columnas */}

                { columnsToFilter.length > 0
                    ?   columnsToFilter.map( (filter, i) => 
                        <li 
                            key={i}
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
                onClick={() => {
                    const val = document.getElementById("filterInput").value;

                    if (newFilter.id !== -1 && val !== "") {

                        // Limpiamos inputs de filtro
                        document.getElementById("filterInput").value = ""
                        setNewFilter(defaultFilter);

                        // Aplicamos el filtro
                        handleAddFilter({value: val, ...newFilter});
                    }
                }}>
                Aplicar
            </button>

            { /* Setea el nuevo valor del filtro */}
            <input
                id="filterInput"
                type="text" 
                className="form-control" 
                aria-label="Valor del filtro"
                placeholder="Valor del filtro...">
            </input>
        </div>
    );
}

const Filters = ({columnsToFilter, handlers, filters}) => {
    return (
        <Fragment>
            <FilterFields 
                columnsToFilter={columnsToFilter.filter( ({id}) => !isInArr(id, filters))}
                handleAddFilter={handlers.handleAddFilter}/>
            
            {/* Aca van los alerts con el filtro especificado  */}
            {filters.map( (filter, i) => 
                <FilterItem 
                    key={i}
                    filter={filter}
                    handleRemoveFilter={handlers.handleRemoveFilter}/>)}
        </Fragment>
    );
}

const Table = ({ tableColumns, handleGetData }) => {
    const initial = {
        tableData: [],
        filters: []
    }
    const [tableData, setTableData] = useState(initial.tableData)
    const [addedFilters, setFilter] = useState(initial.filters);

    const handleAddFilter = newFilter => {
        setFilter([...addedFilters, newFilter]);
    }
    const handleRemoveFilter = removeId => {
        setFilter(addedFilters.filter( ({id}) => id !== removeId))
    }

    // Obtener data de la API
    useEffect(() => {

    }, [])

    return (
        <Fragment>

            {/* Se filtra por todas las columnas */}
            <Filters 
                columnsToFilter={tableColumns}
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
                        {/* mapear data */}
                    </tbody>
                </table>
            </div>

            {/* Paginacion */}

            {/* Cuidado con lo responsive al usar rows: revisar */}
            <div className="row">

                <Pagination />
                
                <div className="col col-sm-auto align-self-end">
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
                </div>
            </div>
            
        </Fragment>
    );
}

const Pagination = () => {
    return (
        <div className="col align-self-start">
            <div className="input-group input-group-sm mt-3">
                {/* Izquierda */}
                <button 
                    className="btn btn-outline-secondary" 
                    type="button">
                    <AwesomeIcon icon="angle-double-left"/>
                </button>
                <button 
                    className="btn btn-outline-secondary" 
                    type="button">
                    <AwesomeIcon icon="angle-left"/>
                </button>

                {/* Mapear numeracion */}
                {[1,2,3,"...",6].map( (e, i) => 
                    <button 
                        key={i}
                        className="btn btn-outline-secondary" 
                        type="button">
                        {e}
                    </button>)}

                {/* Derecha */}
                <button 
                    className="btn btn-outline-secondary" 
                    type="button">
                    <AwesomeIcon icon="angle-right"/>
                </button>
                <button 
                    className="btn btn-outline-secondary" 
                    type="button">
                    <AwesomeIcon icon="angle-double-right"/>
                </button>
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