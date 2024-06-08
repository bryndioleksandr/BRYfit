import { backURL, getUser } from "../config.js";
// Оновлення токена доступу
export const refreshToken = async () => {
    return new Promise( (res, rej) => {
        fetch(`${backURL}/user/refresh_token`, {
            method: 'POST',
            mode: 'cors', 
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            const user = getUser();
            // Обробка отриманих даних
            if (data.msg === 'Token updated successful') {
                    console.log(data);
                    res();
            }
            if (data.message === 'Invalid access token') {
                if (user) {
                    localStorage.clear();
                    location.reload();
                }
            }
            if (data.message === 'Authorization error') {
                // console.error(data.message, '- Please, LogIN');
                rej("Please, LogIN", data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            rej(error);
        });
    })    
}


refreshToken();
// Оновлювати токен кожні 3 хвилин
setInterval(refreshToken, 3 * 60 * 1000);


