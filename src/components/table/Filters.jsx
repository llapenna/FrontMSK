// Core
import {useState, useEffect, Fragment} from 'react'

// Others
import { TableContext } from './Table'
import { removeFromArray, isInArr } from '../../utils/functions'

// export const FilterItem = ({filter, handleRemoveFilter}) => {
//     return (
//         <div 
//             className="alert alert-success alert-dismissible fade show me-3"
//             style={{display:"inline-block"}}
//             role="alert">
//             {filter.name}:  {filter.value}
//             <button 
//                 type="button" 
//                 className="btn-close" 
//                 data-bs-dismiss="alert" 
//                 aria-label="Close"
//                 onClick={ () => {handleRemoveFilter(filter.id);  }}>
//             </button>
//         </div>
//     );
// }


// export const FilterField = ({filterBy, handleAddFilter}) => {
//     const defaultFilter = {
//         id: -1,
//         key: "null",
//         name: "Seleccionar Filtro"
//     }
//     const nullFilter = {
//         id: -1,
//         key: "null",
//         name: "No quedan filtros"
//     }

//     // Filtro seleccionado en el dropdown
//     const [newFilter, setNewFilter] = useState(filterBy.length === 1 ? filterBy[0] : defaultFilter);

//     const inputDisabled = filterBy.length === 0;

//     // Setea el nuevo filtro
//     const handleNewFilter = filter => {
//         setNewFilter(filter);
//     }

    
//     useEffect( () => {
//         setNewFilter(filterBy.length === 1 ? filterBy[0] : defaultFilter);
//     }, [filterBy.length]) // Se ejecuta cada vez que cambia la cantidad de filtros posibles

//     return (
//     <div className="row">
//         <div className="col col-md-6">
//             <div className="input-group input-group-sm mb-3">

//             { /* Boton que abre el dropdown */ }

//             <button
//                 className="btn btn-outline-secondary dropdown-toggle" 
//                 type="button" 
//                 data-bs-toggle="dropdown" 
//                 aria-expanded="false"
//                 disabled={filterBy.length > 1 ? true : false}>
//                 {filterBy.length === 0 ? nullFilter.name : newFilter.name}
//             </button>

//             {/* {filterBy.length > 1 
//             ? <button
//                 className="btn btn-outline-secondary dropdown-toggle" 
//                 type="button" 
//                 data-bs-toggle="dropdown" 
//                 aria-expanded="false"
//                 disabled={false}>
//                 {newFilter.name}
//             </button>
//             : <button
//                 className="btn btn-outline-secondary" 
//                 type="button" 
//                 disabled={true}>
//                 {filterBy.length === 0 ? nullFilter.name : newFilter.name}
//             </button>} */}

//                 { /* Dropdown para elegir filtro */ }
//                 <ul className="dropdown-menu">
//                     {/* Mapear columnas */}

//                     { filterBy.length > 0
//                         ?   filterBy.map( filter => 
//                             <li 
//                                 key={filter.id}
//                                 className="dropdown-item"
//                                 style={{cursor:'pointer'}}
//                                 filterid={filter.id}
//                                 filterkey={filter.key}
//                                 onClick={() => handleNewFilter(filter)}>
//                                 {filter.name}
//                             </li>)
//                         :   <li
//                                 className="dropdown-item">
//                                 No hay más filtros
//                             </li>}
//                 </ul>

//                 { /* Introducir el valor del filtro */}
//                 <input
//                     type="text" 
//                     className="form-control" 
//                     aria-label="Valor del filtro"
//                     placeholder="Valor del filtro..."
//                     disabled={inputDisabled}>
//                 </input>

//                 { /* Aplica el nuevo filtro */ }
//                 <button 
//                     className="btn btn-outline-success" 
//                     type="button"
//                     onClick={e => {
//                         const input = e.target.previousSibling;
//                         const value = input.value;

//                         // Verificamos que no sea el filtro por defecto, o que no haya un valor
//                         if (newFilter.id !== -1 && value !== "") {

//                             // Limpiamos inputs de filtro
//                             input.value = ""

//                             if (filterBy.length === 1) {
//                                 setNewFilter(nullFilter)
//                             } else { //if (filterBy.length === 1) {
//                                 setNewFilter(filterBy.filter( f => f.id === newFilter.id));
//                             }
                        
//                             // if (filterBy.length > 1)
//                             //     setNewFilter(defaultFilter);
//                             // else setNewFilter()

//                             // Aplicamos el filtro
//                             handleAddFilter({value, ...newFilter});
//                         }
//                     }}
//                     disabled={inputDisabled}>
//                     Buscar
//                 </button>
//             </div>
//         </div>
//     </div>
    
// );
// }

// // Contiene ambos SingleFilter como DropdownFilter
// // const FilterInputs = ({filterBy, handleAddFilter}) => {

// //     return (

// //     );
// // }



// //     return (
// //         <div className="row">
// //             <div className="col col-md-6">
// //                 <div className="input-group input-group-sm mb-3">

// //                     { /* Boton que abre el dropdown */ }
// //                     {/* { fixedFilter 
// //                     ? <button
// //                         className={`btn btn-outline-secondary`}
// //                         type="button"
// //                         data-bs-toggle="dropdown" 
// //                         aria-expanded="false"
// //                         disabled={true}>
// //                             {newFilter.name}
// //                     </button>
// //                     : 
// //                     <button
// //                         className={`btn btn-outline-secondary ${dropdownDisabled ? "" : "dropdown-toggle"}`}
// //                         type="button"
// //                         data-bs-toggle="dropdown" 
// //                         aria-expanded="false"
// //                         disabled={dropdownDisabled}>
// //                             {newFilter.name}
// //                     </button>} */}

// //                 {filterBy.length > 1 
// //                 ? <button
// //                     className="btn btn-outline-secondary dropdown-toggle" 
// //                     type="button" 
// //                     data-bs-toggle="dropdown" 
// //                     aria-expanded="false"
// //                     disabled={isDisabled}>
// //                     {newFilter.name}
// //                 </button>
// //                 : <button
// //                     className="btn btn-outline-secondary" 
// //                     type="button" 
// //                     disabled={true}>
// //                     {filterBy.length === 0 ? nullFilter.name : newFilter.name}
// //                 </button>}

// //                     { /* Dropdown para elegir filtro */ }
// //                     <ul className="dropdown-menu">
// //                         {/* Mapear columnas */}

// //                         { filterBy.length > 0
// //                             ?   filterBy.map( filter => 
// //                                 <li 
// //                                     key={filter.id}
// //                                     className="dropdown-item"
// //                                     style={{cursor:'pointer'}}
// //                                     filterid={filter.id}
// //                                     filterkey={filter.key}
// //                                     onClick={() => handleNewFilter(filter)}>
// //                                     {filter.name}
// //                                 </li>)
// //                             :   <li
// //                                     className="dropdown-item">
// //                                     No hay más filtros
// //                                 </li>}
// //                     </ul>

// //                     { /* Introducir el valor del filtro */}
// //                     <input
// //                         type="text" 
// //                         className="form-control" 
// //                         aria-label="Valor del filtro"
// //                         placeholder="Valor del filtro..."
// //                         disabled={inputDisabled}>
// //                     </input>

// //                     { /* Aplica el nuevo filtro */ }
// //                     <button 
// //                         className="btn btn-outline-success" 
// //                         type="button"
// //                         onClick={e => {
// //                             const input = e.target.previousSibling;
// //                             const value = input.value;

// //                             // Verificamos que no sea el filtro por defecto, o que no haya un valor
// //                             if (newFilter.id !== -1 && value !== "") {

// //                                 // Limpiamos inputs de filtro
// //                                 input.value = ""

// //                                 if (filterBy.length === 1) {
// //                                     setNewFilter(nullFilter)
// //                                 } else { //if (filterBy.length === 1) {
// //                                     setNewFilter(filterBy.filter( f => f.id === newFilter.id));
// //                                 }
                            
// //                                 // if (filterBy.length > 1)
// //                                 //     setNewFilter(defaultFilter);
// //                                 // else setNewFilter()

// //                                 // Aplicamos el filtro
// //                                 handleAddFilter({value, ...newFilter});
// //                             }
// //                         }}
// //                         disabled={inputDisabled}>
// //                         Buscar
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
        
// //     );
// // }


// export const Filters = () => {
//     return (
//         <TableContext.Consumer>
//             { state =>
//             <Fragment>

//                 {/* Dropdown e input de los filtros */}
//                 <FilterField
//                     // Evita renderizar filtros ya utilizados
//                     filterBy={state.filters.filter( ({id}) => !isInArr(id, state.filters))}
//                     handleAddFilter={state.handlers.addFilter}/>

//                 {/* Alerts con filtros ya aplicados */}
//                 { state.filters.map( (filter) => 
//                     <FilterItem 
//                         key={filter.id}
//                         filter={filter}
//                         handleRemoveFilter={state.handlers.removeFilter}/>
//                 )}

//             </Fragment>
//             } 
//         </TableContext.Consumer>
//     );
// }








const FilterField = ({availableFilters, handleAddFilter}) => {
    const nullFilter = {
        id: -1,
        key: "null",
        name: "No quedan filtros"
    }
    const [newFilter, setNewFilter] = useState(availableFilters.length !== 0 ? availableFilters[0] : nullFilter);

    const inputDisabled = availableFilters.length === 0;

    // Setea el nuevo filtro
    const handleNewFilter = filter => {
        setNewFilter(filter);
    }

    useEffect( () => {
        setNewFilter(availableFilters.length === 1 ? availableFilters[0] : nullFilter);
    }, [availableFilters.length])

    return (
        <div className="row">
            <div className="col col-md-6">
                <div className="input-group input-group-sm mb-3">

                {/* Boton que abre el dropdown */}
                <button
                    className={`btn btn-outline-secondary ${availableFilters.length > 1 ? "dropdown-toggle" : ""}`}
                    type="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    disabled={availableFilters.length > 1 ? false : true}>
                    {availableFilters.length === 0 ? nullFilter.name : newFilter.name}
                </button>   

                    { /* Dropdown para elegir filtro */ }
                    <ul className="dropdown-menu">
                        { availableFilters.map( filter =>

                        <li
                            key={filter.id}
                            className="dropdown-item"
                            style={{cursor:'pointer'}}
                            filterid={filter.id}
                            filterkey={filter.key}
                            onClick={() => handleNewFilter(filter)}>

                            {filter.name}
                        </li>
                        )}
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

                                if (availableFilters.length === 1) {
                                    setNewFilter(nullFilter)
                                } else {
                                    setNewFilter(availableFilters.filter( f => f.id === newFilter.id));
                                }

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


// Contiene tanto los input para filtros dropdown como customs
const FilterInputs = () => {
    return (

        <TableContext.Consumer>
            { state =>
            
            // TODO: Buscar la posibilidad de agregar un solo boton general para realizar las busquedas
            // y no un boton para cada input
            <Fragment>

                {/* Filtros custom */}
                { state.customFilter.map( (filter) =>
                    <FilterField
                        key={filter.id}
                        // Si esta usado como filtro, no lo renderiza/bloquea el input
                        availableFilters={[filter].filter( ({id}) => !isInArr(id, state.filters))}
                        handleAddFilter={state.handlers.addFilter}/>
                )}


                {/* Filtros dropdown */}
                <FilterField 
                    // Filtra los filtros ya usados
                    availableFilters={state.filterBy.filter( ({id}) => !isInArr(id, state.filters))}
                    handleAddFilter={state.handlers.addFilter}/>

            </Fragment>

            }
        </TableContext.Consumer>
    );
}

// Muestra los filtros ya aplicados
const FilterAlert = ({filter, handleRemoveFilter}) => {
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


const Filters = () => {
    return (
        <TableContext.Consumer>
            { state =>

            // Renderizar solamente si se dispusieron filtros
            state.filterBy !== null &&
            <Fragment>

                {/* Dropdowns e inputs de filtros */}
                <FilterInputs 
                    customFilter={state.customFilter}
                    filterBy={state.filterBy}
                    handleAddFilter={state.handlers.addFilter}/>

                {/* Filtros ya aplicados */}
                {/* TODO: Posible implementacion de un row */}
                {state.filters.map( filter =>
                    <FilterAlert 
                        key={filter.id}
                        filter={filter}
                        handleRemoveFilter={state.handlers.removeFilter} />
                )}

            </Fragment>

            }
        </TableContext.Consumer>
    );
}

export default Filters;