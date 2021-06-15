import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const service = 'role'

export const getRoles = async () => {
    const method = 'getAll';

    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: myCookies.user.get().token
        })
    }

    const response = 
        await fetch(`${apiHost}/${service}/${method}/`, options)
                .then(response => response)

    if (response.status === 200) {
        const data = await response.json().then(data => data);

        return data.RoleList.map( r => { return {
            id: r.Id,
            name: r.Name,
            text: r.Name
        }});
    } else return []
}


const role = {
    getAll: getRoles
}

export default role
