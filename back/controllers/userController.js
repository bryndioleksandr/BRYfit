import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";


export const userRegister = async (req, res) => {
    try {
        const {userRegName, userRegEmail, userRegPassword} = req.body;
        
        // Перевіряємо чи є вже електронна пошта в базі
        const user = await User.exists({ email: userRegEmail})
        
        if (user) return res.json({msg: "This email is already in use"})

        // Шифруємо пароль
        const passwordHash = await bcrypt.hash(userRegPassword, 10);
        
        // Інстанс нового юзера
        const newUser = new User ({
            name: userRegName,
            email: userRegEmail,
            password: passwordHash
        });
        
        // Запис в БД
        await newUser.save()
        // Отримання збереженого об'єкту користувача після запису в базу даних
        .then(savedUser => {
            // Вибираємо потірбні поля для відправки на клієнт
            const resUser = {
                _id: savedUser._id,
                name: savedUser.name,
                // email: savedUser.email,
                isAdmin: savedUser.isAdmin,
                cart: savedUser.cart
            }
            // Створюємо два JWT-токени 
            // accesstoken  - з коротким терміном дії для авторизації 
            // refreshtoken - з довгим терміном дії для можливості оновлення accesstoken
            const accesstoken = createAccessToken({_id: newUser._id});
            const refreshtoken = createRefreshToken({_id: newUser._id});
            // Відправляємо токени в куки
            res.cookie('accessToken', accesstoken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.cookie('refreshToken', refreshtoken, { httpOnly: true, secure: true, sameSite: 'none' });
            // Відправляємо в куки об'єкт користувача
            // res.cookie('user', JSON.stringify(reqUser), { maxAge: 3600000, httpOnly: false, sameSite: 'none' }); // 60*60*1000 - година
            res.status(200).json(resUser); ;
            // res.status(200).json({msg : "Registration successful"});
            
          })
          .catch(error => {
            console.log(error);
            res.status(401).json({ message: 'Помилка реєстрації' });
          });

    } catch (error) {
        console.error(error);
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
          
        if (!refreshToken)  return res.status(401).json({ msg: "Помилка оновлення токена. Refreshtoken відсутній" });
  
        new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                        if (err) { reject(err);} else {resolve(decoded);}
                    });
            })
            .then(decoded => {
            // Токен валідний, доступ до decoded даних
            // Отримання ідентифікатора користувача з refreshToken
            const userId = decoded._id;
            
            // Оновлення токена доступу
            const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    
            // Відправка нового токена в HTTP-Only куку на клієнт
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).json({ msg: 'Token updated successful' });
            
            })
            .catch(err => {
                res.status(401).json({ message: 'Invalid access token' });
            });
        
        // Перевірка оновлювального токена
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        

    } catch (error) {
        console.error('Помилка перевірки або оновлення токена:', error);
        res.status(401).json({ msg: 'Недійсний оновлювальний токен' });
    }
}

export const userLogout = async (req, res) => {
    try {
        // Видалення токенів з кукі
        res.clearCookie('accessToken', {sameSite: "none", secure: true});
        res.clearCookie('refreshToken', {sameSite: "none", secure: true});
        res.status(200).json({ msg: 'Logout completed' });
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export const userLogin = async (req, res) => {
    try {
        // Отримання даних з тіла запиту
        const { userLoginEmail, userLoginPassword } = req.body;

        // Перевірка чи існує користувач 
        User.findOne({email: userLoginEmail})
            .then(user => {
                if(!user) return res.status(400).json({emailMsg: "User doesn't exist"})
        
            // Перевірка паролю
            bcrypt.compare(userLoginPassword, user.password)
                .then(match => {
                    if (match) {
                        // Якщо авторизація успішна
                        // Вибираємо окремі поля користувача для відправки на клієнт
                        const logedUser = {
                            _id: user._id,
                            name: user.name,
                            // email: user.email,
                            isAdmin: user. isAdmin,
                            cart: user.cart
                        }
                        // Відсилаємо на клієнт в куки об'єкт користувача
                        // res.cookie('user', JSON.stringify(logedUser), { maxAge: 3600000, httpOnly: false, secure: true, sameSite: 'none' }); // 60*60*1000
                        
                        // ствропення та відправка в куки токенів
                        const accesstoken = createAccessToken({_id: user._id});
                        const refreshtoken = createRefreshToken({_id: user._id});
                        // Відправляємо токени в куки
                        res.cookie('accessToken', accesstoken, { httpOnly: true, secure: true, sameSite: 'none' });
                        res.cookie('refreshToken', refreshtoken, { httpOnly: true, secure: true, sameSite: 'none' });
                        
                        // res.status(200).json(logedUser);
                        res.status(200).json(logedUser); 
                    } else {
                        res.status(400).json({pwdMsg: "The password is incorrect"})
                    }
                })
                .catch(err => {
                    res.status(500).json({ message: 'Password decryption error' });
                  });
        })

    } catch (error) {
        return res.status(500).json({msg: err.message})
    }
}

export const cartUpdate = async (req, res) => {
    try {
        await User.findByIdAndUpdate (req.body._id, {cart: req.body.cart}, { new: true })
        .then (updatedUser => {
            res.status(200).json({user: updatedUser});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}