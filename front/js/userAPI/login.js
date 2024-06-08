import { getAllCategoriesFromDB } from "../categoryAPI/category.js";
import { backURL, getUser, setUser } from "../config.js";
import { loginModal } from "../modals/loginModal.js";
import { navbarRender } from "../navbar.js";
import { getAndShowAllProducts } from "../productAPI/products.js";
//
// ***** Авторизація користувача *****
//

// Функція для відправки запиту авторизації 
export const userLogin = async () => {
    const reqBody = {
        userLoginEmail: document.getElementById('userLoginEmail').value,
        userLoginPassword: document.getElementById('userLoginPassword').value
    }
    const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',   // Встановлення Content-Type на "application/json"
        },
        mode: 'cors', 
        credentials: 'include',                 // Don't forget to specify this if you need cookies
        body: JSON.stringify(reqBody),          // Перетворення даних форми в JSON-рядок
      };

      fetch(`${backURL}/user/login`, requestOptions)
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            // Обробка відповіді від сервера
            // Обробка повідомлення про наявну email
            if (data.emailMsg) {
                document.getElementById('loginEmailError').innerText =`${data.emailMsg}`;
                
            } else
            if (data.pwdMsg) {
                document.getElementById('loginPasswordError').innerText =`${data.pwdMsg}`
            }
            else {
                // Очищуємо поля форми
                document.forms["loginForm"].reset();
                // Закриваємо модальне вікно
                loginModal.close();
                // Реєструємо отримані дані про користувача 
                // (для збереження стану авторизації після перезавантаження сторінки)
                setUser(data);
                // Рендеримо меню авторизованого користувача
                navbarRender(getUser());
                // Рендеримо карточки продуктів
                await getAndShowAllProducts();
                // Забираємо категорії товарів з сервера
                if (data.isAdmin) { 
                    await getAllCategoriesFromDB();                    
                 };
            }
        })
        .catch(err => {
            console.error(err);
        });
}

