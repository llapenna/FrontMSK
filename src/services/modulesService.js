import { apiHost } from '../utils/const'
const apiLocation = apiHost + '/api/module/getmodules'


const testObj = [
    {
        Id: 1,
        Icon: "a",
        Name: "Productos",
        PermissionId: 1,
        Integradora: "A"
    },
    {
        Icon: "b",
        Id: 1,
        Name: "Productos",
        PermissionId: 1,
        Integradora: "A"
    },
    {
        Icon: "c",
        Id: 1,
        Name: "Productos",
        PermissionId: 1,
        Integradora: "B"
    },
    {
        Icon: "d",
        Id: 1,
        Name: "Productos",
        PermissionId: 1,
        Integradora: "C"
    },
    {
        Icon: "e",
        Id: 1,
        Name: "Productos",
        PermissionId: 1,
        Integradora: "C"
    }
]


export const getModules = async ({id, token}) => {
    const options = {
        method: 'POST',
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, token})
    }

    const response = 
        await fetch(apiLocation, options)
            .then(response => response);

    if (response.statusText === "OK") {
        const data = 
            await response.json()
                .then(data => data);

        // Agrupa por seccion
        const aux = data.reduce(function (r, a) {
            r[a.Section] = r[a.Section] || [];
            r[a.Section].push(a);
            return r;
        }, Object.create(null));

        const result = [];

        // Convierte cada seccion en un elemento de un array
        for (let key of Object.keys(aux)) {
            result.push({[key]: aux[key], keyName:key})
        }

        return result;
    }
    // Devolvemos un array vacio === no informacion
    else return []
}