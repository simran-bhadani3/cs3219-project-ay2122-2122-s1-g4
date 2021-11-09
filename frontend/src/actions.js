export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user').toString());
}


export function getAuthConfig() {
    const jwt = localStorage.getItem('user').toString();
    const userConfig = {
        headers: {
           "Authorization": jwt.substr(1, jwt.length - 2)
        }
    };
    return userConfig;
}