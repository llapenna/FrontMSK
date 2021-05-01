// Core
import { useContext, useEffect } from 'react'

// Components
import { HomeContext } from '../components/Home'

export const useRestart = func => {

    const voidFunc = () => {
        console.error('Restart not implemented')
    }

    const context = useContext(HomeContext);

    useEffect( () => {
        context.setRestartFunction(prev => func);

        return () => context.setRestartFunction(prev => voidFunc);
    }, [])
}



