import Cookies from 'universal-cookie'

const cookieDuration = 60*30; // 30 minutos
const cookies = new Cookies();

// const tokenService = {
//     get: () => cookies.get('token'),
//     set: token => cookies.set('token', token, 
//         {
//             path: '/',
//             sameSite: 'lax',
//             maxAge: cookieDuration
//         }),
// }

const userService = {
    get: () => cookies.get('user'),
    update: () => cookies.set('user', cookies.get('user')),
    set: user => cookies.set('user', user, 
        {
            path: '/',
            sameSite: 'lax',
            maxAge: cookieDuration
        }),
    remove: () => cookies.remove('user')
}

const myCookies = {
    //token: tokenService,
    user: userService
}

export default myCookies