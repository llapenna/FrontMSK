// Core
import {useState, useEffect, Fragment} from 'react'

// Components
import { TableContext } from './Table'

// Others
import { removeFromArray, isInArr } from '../../utils/functions'



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
        //setNewFilter(availableFilters.length === 1 ? availableFilters[0] : nullFilter);
        setNewFilter(availableFilters.length !== 0 ? availableFilters[0] : nullFilter);
    }, [availableFilters.length])

    return (
        <div className="input-group input-group-sm mb-3">

            {/* Boton que abre el dropdown */}
            <button
                className={`btn btn-outline-secondary ${availableFilters.length > 1 ? "dropdown-toggle" : ""}`}
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                filterid={newFilter.id}
                filterkey={newFilter.key}
                filtername={newFilter.name}
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
            {/* <button 
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
            </button> */}
        </div>
    );
}


// Contiene tanto los input para filtros dropdown como customs
const FilterInputs = ({handleAddFilter, filters, handleSetPage}) => {

    const handleSearch = e => {
        e.preventDefault();
        
        const isValid = filter => {
            const button = filter.querySelector('button');
            const input = filter.querySelector('input');

            
            // Si tenemos un filtro seleccionado, no es el 'null', tenemos valor por cargar, y no está entre los ya elegidos
            const isValid = (
                (button.attributes['filterid'] !== undefined ||
                button.attributes['filterid'] !== -1) && input.value !== "") &&
                !isInArr(button.attributes['filterid'].value, filters)

            return isValid;
        }

        // Funcion que forma el objeto filtro
        const getKeyValue = filter => {
            const button = filter.querySelector('button');
            const input = filter.querySelector('input');

            const inputValue = input.value
            // Una vez obtenido el valor del input, limpiamos
            input.value = "";

            return {
                id: button.attributes['filterid'].value,
                key: button.attributes['filterkey'].value,
                name: button.attributes['filtername'].value,
                value: inputValue,
            }
        }

        // Obtenemos el padre contenedor de los inputs
        const inputs = e.target.querySelectorAll('.input-group');

        const newFilters = 
            [...inputs]
            .filter( f => isValid(f))
            .map( f => getKeyValue(f));

        handleSetPage(1);

        // Pasa un -1 para obligar a buscar
        handleAddFilter(newFilters.length === 0 ? [{id:-1}] : newFilters);
    }
    return (
        <TableContext.Consumer>
            { state =>
            
            // TODO: Buscar la posibilidad de agregar un solo boton general para realizar las busquedas
            // y no un boton para cada input

            <form
                style={{padding: "0"}}
                onSubmit={e => handleSearch(e)}>
                <div className="row mb-4">

                    {/* Inputs de filtros */}
                    <div className="col col-8">

                        {/* Filtros custom */}
                        { state.customFilter.map( filter =>
                            <FilterField
                                key={filter.id}
                                // Si esta usado como filtro, no lo renderiza/bloquea el input
                                availableFilters={[filter].filter( ({id}) => !isInArr(id, state.filters))} />
                        )}


                        {/* Filtros dropdown */}
                        <FilterField 
                            key={state.filterBy.length + 1}
                            // Elimina los filtros ya usados
                            availableFilters={state.filterBy.filter( ({id}) => !isInArr(id, state.filters))} />
                        
                    </div>

                    {/* Boton para buscar, se maneja con onSubmit */}
                    <div className="col col-2 mb-3">
                        <button 
                            className="btn btn-outline-success"
                            style={{height:"100%"}}>
                            Buscar
                        </button>
                    </div>
                </div>
            </form>
            }
        </TableContext.Consumer>
    );
}

// Muestra los filtros ya aplicados
const FilterAlert = ({filter, handleRemoveFilter}) => {
    return (
        //filter.id !== -1 &&
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
                    handleAddFilter={state.handlers.addFilter}
                    filters={state.filters}
                    handleSetPage={state.handlers.setPage}/>

                {/* Filtros ya aplicados */}
                {/* TODO: Posible implementacion de un row */}
                {state.filters
                    .filter( f => f.id !== -1)
                    .map( filter =>
                    <FilterAlert 
                        key={filter.key}
                        filter={filter}
                        handleRemoveFilter={state.handlers.removeFilter} />
                )}
            </Fragment>

            }
        </TableContext.Consumer>
    );
}

export default Filters;