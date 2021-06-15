// Core
import { useEffect } from 'react'

// Services
import test from '../services/testService'

const Test = () => {

    const handleOnChange = value => {
        console.log(`Pure value: ${value}`)
        console.log(`Parsed value: ${parseFloat(value)}`)
    }

    useEffect( () => {
        //console.log()
        //test.getAllOrders().then(d => console.log('Test: ', d))
    })

    return (
        <input 
            onChange={e => handleOnChange(e.currentTarget.value)}
            type='text' />
    )
}

export default Test