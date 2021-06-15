// Components
import { AwesomeIcon } from './Awesome'

const Submit = ({fields, handleSubmit, data}) => {

    const handleOnSubmit = e => {
        // Previene el refresh de la pagina al hacer submit en el form
        e.preventDefault()

        // Capturamos inputs de texto
        const inputs = [...e.currentTarget.querySelectorAll('input')]

        // Del formulario, nos quedamos con los valores de los inputs
        const values = inputs.map( i => i.value)

        // Se fija si algún valor no fue llenado
        if (values.some( v => v === '' || v === ' ') )
            alert('No todos los campos fueron llenados.')
        else
            // El Object.assign permite formar un objeto unico con todas las propiedades
            handleSubmit(Object.assign({},
                // Creamos un array que contiene cada propiedad del input junto con su valor
                ...inputs.map( i => {return { [i['name']]: i.value } }),
                 ))
    }

    return (
        <form onSubmit={e => handleOnSubmit(e)}>

            {/* Mapeamos todas las subdivisiones */}
            {fields.map( ({id, name, rows}) =>
                <div key={id}>

                    <label className="form-label my-4">{name}</label>

                    <SubmitRow rows={rows}/>
                </div>
            )}

            <button className="btn btn-success mt-4"><AwesomeIcon icon='check' /></button>
        </form>
    )
}
const SubmitRow = ({rows}) => {
    
    return (
        rows.filter(r => r?.id !== undefined).map( ({id, field, margin = 0, show = true}) => 
            <div key={id}
                style={{display: show ? '' : 'none'}}
                // Aplica el margen especificado
                className={`col-md-6 order-md-1 ${margin > 0 ? `mb-${margin}`: ''}`}>
                    {field}
            </div>
        )
    )
}

export default Submit