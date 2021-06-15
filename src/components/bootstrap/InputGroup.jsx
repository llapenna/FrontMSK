// Core
import { Fragment, useEffect, useState } from 'react'

// Components
import { AwesomeIcon } from "../Awesome"

// Example:
// [
//     { id: '0', type: 'icon',  icon: 'city'},
//     { id: '1', type: 'text', name:'cuit', placeholder: 'CUIT'},
//     { id: '2', type: 'dropdown', name: '',  getData: () => getData(), handleSelect: () => select() }
// ]

const InputIcon = ({id, icon}) => {

    // No es necesario que lleve una key ya que puede ir dentro de otro objeto
    const key = id 
        ? {key: id}
        : {}

    return (
        <span key={id}
            className='input-group-text'
            {...key}>
            <AwesomeIcon icon={icon} />
        </span>
    )
}
const InputText = ({id, name, placeholder, isPassword = false, icon, data = '', disabled = false}) => {

    const [showPassword, setShowPassword] = useState(false)

    return (
        <Fragment key={id}>

            {icon !== undefined &&
            <InputIcon icon={icon}/>}

            <input 
                className='form-control'
                type={isPassword && !showPassword ? 'password' : 'text'}
                aria-label='cuit'
                name={name}
                placeholder={placeholder}
                defaultValue={data}
                disabled={disabled}/>

            {isPassword && 
            <InputButton 
                text={<AwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />} 
                handleClick={() => setShowPassword(prev => !prev)}/>}
        </Fragment>
        
    )
}
const InputDropdown = ({name, getData, defaultOption, handleSelect, disabled = false}) => {
    
    // Administra los valore seleccionados
    const [fetched, setFetched] = useState([])
    const [selected, setSelected] = useState(defaultOption ?? { id: -1}) // ?? funciona como un ternario pero comparando con undefined
    

    useEffect( () => {

        getData()
            .then(data => {
                setFetched(data)

                if(defaultOption === undefined)
                    setSelected(data[0])
            })
        
    }, [getData, defaultOption])

    const handleClick = s => {
        try {
            handleSelect(s)
        } catch (e){
            console.error('No se proveyó una función handler para el dropdown')
        }
        finally {
            setSelected(s)
        }
    }

    
    return (
        <Fragment>

            <button
                className='btn btn-outline-secondary dropdown-toggle'
                type='button'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                dataid={selected?.id ?? -1}
                disabled={disabled}
                name={name}>

                {/* Operador para comprobar si el campo existe */}
                {selected?.text}
            </button>

            <ul className="dropdown-menu">

                {/* Mostramos cada opcion posible */}
                { fetched.map( f =>  
                    <li key={f.id}
                        className="dropdown-item"
                        onClick={() => handleClick(f)}
                        style={{cursor:"pointer"}}>
                        {f.text}
                    </li>
                )}
            </ul>

        </Fragment>
    )
}

const InputButton = ({text, handleClick}) => {
    return (
            <button
                tabIndex={-1}
                className='btn btn-outline-secondary'
                type='button'
                onClick={handleClick}>
                {text}
            </button>
    )
}

const types = {
    icon: InputIcon,
    text: InputText,
    dropdown: InputDropdown,
    button: InputButton,
    none: () => {}
}

const InputGroup = ({input}) => {

    return (
        <div className='input-group mb-3'>
            { input.filter(i => i?.id !== undefined).map( i => {

                switch (i?.type) {
                    case 'button':
                        return <InputButton 
                            key={i.id} 
                            text={i?.text} 
                            handleClick={i?.handleClick} />

                    case 'dropdown':
                        return <InputDropdown
                            key={i.id} 
                            name={i.name}
                            getData={i?.getData}
                            defaultOption={i?.defaultOption}
                            handleSelect={i?.handleSelect} />

                    case 'text':
                        return <InputText
                            key={i.id}
                            name={i.name}
                            placeholder={i?.placeholder}
                            isPassword={i?.isPassword}
                            icon={i?.icon}
                            data={i?.data}
                            disabled={i?.disabled}/>

                    case 'icon':
                        return <InputIcon 
                            key={i.id}
                            icon={i?.icon}/>

                    default:
                        return undefined
                }
            }
                // Del array obtenemos el tipo de input-group que queremos
                // y le pasamos las props
                // types[i?.type ?? 'none'](i)
            )}
        </div>
    )
}



export default InputGroup