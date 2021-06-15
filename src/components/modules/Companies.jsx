// Core
import {Fragment, useEffect, useState} from 'react'

// Components
import { ModuleTitle, ModuleSection } from "../BasicModule"
import { AwesomeIcon } from '../Awesome'
import InputGroup from '../bootstrap/InputGroup'
import Submit from '../Submit'
import Table from "../table/Table"

// Services
import companyService from '../../services/companiesService'
import userService from '../../services/usersService'
import { useRestart } from '../../hooks/useRestart'

const CompanyList = ({handleSelectCompany}) => {

    // TODO: añadir usuarios y contraseña
    const columns = [
        { id: 0,
            key: 'name',
            name: 'Empresa',
        },
        { id: 1,
            key: 'cuit',
            name: 'CUIT',
        },
        { id: 2,
            key: 'user',
            name: 'Usuario',
        },
        { id: 3,
            key: 'pass',
            name: 'Contraseña',
        },
    ]

    return (
        <Table 
            columns={columns}
            filterBy={[]}
            handleGetData={companyService.getAll}
            handleSelectRow={handleSelectCompany}
            //pagination={false}
            getOnFirstMount={true}
            captionText={"Selecciona una empresa para editarla."}/>
    )
}


const CompanySubmit = ({companyid, restartFunction}) => {

    const [fetchedCompany, setFetchedCompany] = useState({id: -1})
    const editing = companyid !== -1

    useEffect( () => {
        if (editing) {
            companyService.get(companyid)
                .then( c => {
                    if (c?.error === undefined)
                        setFetchedCompany(c)
                })
        }
    }, [companyid, editing])

    const inputs = {
        company: [
            {id: 0, type: 'text', name:'name', placeholder: 'Nombre', icon:'user-edit', disabled: editing, data: fetchedCompany?.name},
            {id: 1, type: 'text', name:'cuit', placeholder: 'CUIT', icon: 'address-card', disabled: editing, data: fetchedCompany?.cuit},
        ],
        username_phone: [
            {id: 0, type: 'text', name:'user', placeholder: 'Usuario', icon: 'user-tie', data: fetchedCompany?.user?.user },
            {id: 1, type: 'text', name:'phone', placeholder: 'Teléfono', icon: 'phone', data: fetchedCompany?.user?.phone},
        ],
        email: [
            {id: 0, type: 'text', name:'email', placeholder: 'E-Mail', icon: 'envelope', data: fetchedCompany?.user?.email},
        ],
        password: [
            {id: 0, type: 'text', name:'pass', placeholder: 'Contraseña', isPassword: true, icon: 'lock',},
        ],
        confirmPassword: [
            {id: 0, type: 'text', name:'confirmPass', placeholder: 'Confirmar Contraseña', isPassword: true, icon: 'lock'},
        ]
    }

    
    const handleCreateCompany = c => {
        companyService.add(c)
            .then( r => {
                if (r?.error === undefined){
                    alert('Empresa creada con éxito')
                    restartFunction()
                }
                else alert(r?.error)
            })
    }
    const handleUpdateCompanyUser = u => {
        userService.update(u)
            .then( r => {
                if (r?.error === undefined) {
                    alert('Usuario modificado con éxito.')
                    restartFunction()
                }
                else alert(r?.error)
            })
    }
    const handleCancelEditCompanyUser = () => {
        setFetchedCompany({id: -1})
        restartFunction()
    }

    const handleSubmit = (e, form) => {
        e.preventDefault()

        const inputs = [...form.querySelectorAll('input:enabled')]

        if (inputs.some(i => i.value === '' || i.value === ' '))
            alert('No todos los campos fueron llenados.')
        else {

            // const c = 
            //     Object.Assing({}, 
            //         ...inputs.map( i => { return { [i['name']]: i.value }}),
            //         ...{ roles:  [{ id: 1 }]})

            const company =
                Object.assign({},
                    ...inputs.map( i => { return { [i['name']]: i.value }}),
                    { roles: [{id: 1}] })

            if (company.pass === company.confirmPass) {
                if (editing)
                    handleUpdateCompanyUser({
                        id: fetchedCompany.user.id,
                        user: company.user,
                        pass: company.pass,
                        phone: company.phone,
                        email: company.email,
                        // Pasa el id del rol de administrador
                        roles: [{id: 1}]
                    })
                else
                    handleCreateCompany({...company, id: fetchedCompany.id})
            }
            else alert('Las contraseñas no coinciden.')
        }
    }


    return (
        <form onSubmit={e => handleSubmit(e, e.currentTarget)}>

            <label className="form-label my-4">Empresa</label>

                        
            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.company}/>
            </div>


            <label className="form-label my-4">Usuario Administrador</label>

                        
            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.username_phone}/>
            </div>
            <div className='col-md-6 order-md-1 mb-5'>
                <InputGroup input={inputs.email}/>
            </div>

            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.password}/>
            </div>
            <div className='col-md-6 order-md-1'>
                <InputGroup input={inputs.confirmPassword}/>
            </div>

            <button type='submit' className="btn btn-success mt-4 me-3"><AwesomeIcon icon={`${editing ? 'save' : 'check'}`} /></button>
            {editing &&
            <button className="btn btn-danger mt-4 me-3" onClick={handleCancelEditCompanyUser}><AwesomeIcon icon='times' /></button>}

        </form>
    )
}


// Submit and listing
const Companies = () => {
    const [companyid, setCompanyId] = useState(-1)
    const [restart, setRestart] = useState(0)

    const moduleRestart = useRestart( () => {
        setCompanyId(-1)
        setRestart(prev => prev + 1)
    })

    const handleSelectCompany = row => {
        setCompanyId(row.attributes["dataid"].value);
    }

    const moduleName = 'Company'

    return (
        // Utiliza 'key' para volver a renderizar el modulo
        <Fragment key={restart}>
            
            <ModuleTitle text={'Empresas'} />

            <div className="accordion custom-accordion" id={`accordion${moduleName}`}>
                
                <ModuleSection
                    i={0}
                    sectionName={`${companyid === -1 ? 'Crear' : 'Modificar'} Empresa`}
                    section={ <CompanySubmit 
                                restartFunction={moduleRestart}
                                companyid={companyid}/> }
                    moduleName={moduleName}>
                </ModuleSection>

                { companyid === -1 &&
                <ModuleSection
                    i={1}
                    sectionName="Listado de Empresas"
                    section={ <CompanyList handleSelectCompany={handleSelectCompany} /> }
                    moduleName={moduleName}>
                </ModuleSection>}
            </div>
        </Fragment>
    )
}

export default Companies