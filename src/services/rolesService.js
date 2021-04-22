import myCookies  from './cookiesService'
import { apiHost } from '../utils/const'

const apiLocation = apiHost + 'role'

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
        await fetch(`${apiLocation}/${method}/`, options)
                .then(response => response)

    if (response.status == 200) {
        const data = await response.json().then(data => data);

        return data.RoleList;
    } else return []
}
