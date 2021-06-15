// Core
import {Fragment, useState, useEffect} from 'react'

// Components
import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from '../Awesome'
import InputGroup from '../bootstrap/InputGroup'
import Submit from '../Submit'
import Table from "../table/Table"

// Services
import userService from '../../services/usersService'
import roleService from '../../services/rolesService'

// Custom hooks
import { useRestart } from '../../hooks/useRestart'



const UserList = ({restartFunction, handleSelectUser}) => {

    const columns = [
        {
            id: 0,
            key: "User",
            name: "Usuario"
        },
        {
            id: 1,
            key: "Mail",
            name: "E-Mail"
        },
        {
            id: 2,
            key: "Phone",
            name: "Teléfono"
        }
    ]

    const handleDeleteUser = button => {
        // Obtenemos el id de la 'row' que contiene al boton
        const id = button.parentElement.parentElement.attributes['dataid'].value;

        userService.delete(id)
            .then(r => {

                if (r?.error === undefined) {
                    alert('Usuario suspendido con éxito.')
                    restartFunction()
                }
                else alert(r.error)
            })
    }
    
    return (
        <Table 
            columns={columns}
            filterBy={null}
            handleGetData={userService.getAll}
            handleSelectRow={handleSelectUser}
            captionText={"Selecciona un usuario para editarlo."}
            customCell={[{
                id: 0, 
                component: 
                    <button 
                        className="btn btn-danger"
                        onClick={e => handleDeleteUser(e.currentTarget)}>
                        <AwesomeIcon icon="times"/>
                    </button>
                }]}/>
    )
}

const UserSubmit = ({userid, restartFunction}) => {
    const [user, setUser] = useState({id: -1})
    const [role, setRole] = useState({id: -1})  

    useEffect( () => {
        if (userid !== -1) {
            userService.get(userid)
                .then( data => {
                    if (data?.error === undefined)
                        setUser(data)
                })
        }
    }, [userid])

    const inputs = {
        user_role: [
            {id: 0, type: 'text', name:'user', placeholder: 'Usuario', icon:'user-edit', data: user?.user},
            {id: 1, 
                type: 'dropdown', 
                name: 'role', 
                getData: roleService.getAll, 
                handleSelect: r => setRole(r)
            },
        ],
        user: [{id: 0, type: 'text', name:'user', placeholder: 'Usuario', icon:'user-edit', data: user?.user},],
        phone_email: [
            {id: 0, type: 'text', name:'phone', placeholder: 'Teléfono', icon: 'phone', data: user?.phone },
            {id: 1, type: 'text', name:'email', placeholder: 'E-Mail', icon: 'envelope', data: user?.email},
        ],
        password: [
            {id: 0, type: 'text', name:'pass', placeholder: 'Contraseña', isPassword: true, icon: 'lock', data: user?.pass},
        ],
        confirmPassword: [
            {id: 0, type: 'text', name:'confirmPass', placeholder: 'Confirmar Contraseña', isPassword: true, icon: 'lock',},
        ],
        seller: [
            {id: 0, type: 'text', name:'seller', placeholder: 'Número de Vendedor', icon: 'tag', data: user?.seller},
        ],
        customer: [
            {id: 0, type: 'text', name:'customer', placeholder: 'Número de Cliente', icon: 'tag', data: user?.customer},
        ]
    }

    const handleCreateUser = u => {
        userService.add(u)
            .then( r => {
                if (r?.error === undefined) {
                    alert('Usuario agregado con éxito.')
                    restartFunction()
                }
                else alert(r.error)
            })
    }

    const handleUpdateUser = u => {
        userService.update(u)
            .then( r => {
                if (r?.error === undefined) {
                    alert('El usuario ha sido modificado con éxito.')
                    restartFunction()
                }
                else alert(r.error)
                    
            })
    }
    
    const cancelEditUser = () => {
        setUser({id: -1})
        setRole({id: -1})

        restartFunction()
    }    

    const handleSubmit = (e, form) => {

        e.preventDefault()

        const inputs = [...form.querySelectorAll('input')]
        const dropdowns = [...form.querySelectorAll('button.dropdown-toggle')]
        
        // Nos fijamos si falto algun campo por llenar
        if (inputs.some(i => i.value === '' || i.value === ' '))
            alert('No todos los campos fueron llenados.')
        else if (dropdowns.some(d => d.attributes['dataid'].value === -1))
            alert('No se seleccionaron todas las opciones.')
        else {
            // Creamos un objeto con todos los campos
            const user =
                Object.assign({},
                    ...inputs.map( i => { return { [i['name']]: i.value }}),
                    { roles: 
                        userid === -1 
                        ? [{ id: dropdowns[0].attributes['dataid'].value }]
                        : {}
                    })

            if (user.pass === user.confirmPass) {
                if (userid !== -1)
                    handleUpdateUser({...user, id: userid})
                else 
                    handleCreateUser(user)
            } else alert('Las contraseñas no coinciden.')
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e, e.currentTarget)}>

            <label className="form-label my-4">Información Básica</label>

            
            <div className='col-md-6 order-md-1'>
                <InputGroup input={userid !== -1 ? inputs.user : inputs.user_role}/>
            </div>

            {role?.name === 'Vendedor' &&
            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.seller}/>
            </div>}

            {role?.name === 'Cliente' &&
            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.customer}/>
            </div>}

            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.phone_email}/>
            </div>


            <label className="form-label my-4">Contraseña</label>

            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.password}/>
            </div>

            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.confirmPassword}/>
            </div>

            <button type='submit' className="btn btn-success mt-4 me-3"><AwesomeIcon icon={`${userid !== -1 ? 'save' : 'check'}`} /></button>
            {userid !== -1 &&
            <button className="btn btn-danger mt-4 me-3" onClick={cancelEditUser}><AwesomeIcon icon='times' /></button>}

        </form>



        // <Submit 
        //     fields={fields}
        //     handleSubmit={handleCreateUser}/>
    )
}

// TODO: Cuando se elimina el usuario del que esta logueado, o se lo modifica, debe desloguearse
// TODO: Implementar animaciones al transicionar estados
// Submit and listing
const Users = () => {
    const [userid, setUserId] = useState(-1)
    const [restart, setRestart] = useState(0)
    //const [editing, setEditing] = useState(false)

    const moduleRestart = useRestart( () => {
        setUserId(-1)
        setRestart(prev => prev + 1)
    })

    const handleSelectUser = row => {
        setUserId(row.attributes["dataid"].value);
    }

    const moduleName = 'User'

    return (
        // Utiliza 'key' para volver a renderizar el modulo
        <Fragment key={restart}>
            
            <ModuleTitle text={'Usuarios'} />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>
                
                <ModuleSection
                    i={0}
                    sectionName={`${userid === -1 ? 'Crear' : 'Modificar'} Usuario`}
                    section={ <UserSubmit 
                                userid={userid} 
                                restartFunction={moduleRestart}/> }
                    moduleName={moduleName}>
                </ModuleSection>

                { userid === -1 &&
                <ModuleSection
                    i={1}
                    sectionName="Listado de Usuarios"
                    section={ <UserList 
                                handleSelectUser={handleSelectUser} 
                                restartFunction={moduleRestart}/> }
                    moduleName={moduleName}>
                </ModuleSection>}
            </div>
        </Fragment>
    )
}

export default Users