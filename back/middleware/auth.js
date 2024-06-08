import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken) return res.status(400).json({message: "Authorization error"})
        new Promise((resolve, reject) => {
                jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
                            if (err) { reject(err) } 
                            else { resolve(decodedUser) }
                });
        })
        .then(decodedUser => {
        // Токен валідний, доступ до decoded даних
        // В decoded прилітає з клієнта id користувача з папаметрами 
        // життя токена типу { id: '64a8c35b12c38df8f9766862', iat: 1689344685, exp: 1689345585 }
        // Прикручуємо цей об'єкт до запиту (req) і викликаємо наступний middleware ( next() )
        // По суті передаємо цей об'єкт в authAdmin.js, де будемо перевіряти по id,  
        // чи користувач є адміністратором
        req.user = decodedUser;})
        .then (() => {
            next() 
        })
        .catch(err => {
            res.status(401).json({ message: 'Invalid access token' });
        });
        }
    catch (error) {
        return res.status(500).json({msg: error.maggage})
    }
}