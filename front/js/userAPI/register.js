import { backURL, getUser, setUser } from "../config.js";
import { registrationModal } from "../modals/registrationModal.js";
import { navbarRender } from "../navbar.js";
import { getAndShowAllProducts } from "../productAPI/products.js";

//
// ***** Реєстрація користувача *****
///

// Функція для відправки запиту реєстраці 
export const userRegistetion = async () => {
    // const reqBody = collectUserFormData("registerForm");
    const reqBody = {
        userRegName: document.getElementById('userRegName').value,
        userRegEmail: document.getElementById('userRegEmail').value,
        userRegPassword: document.getElementById('userRegPassword').value
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
      
      fetch(`${backURL}/user/register`, requestOptions)
        .then(response => response.json())
        .then(data => {
            // Обробка відповіді від сервера
            // Обробка повідомлення про наявну email
            if (data.msg) {
                document.getElementById('registerEmailError').innerText =`${data.msg}`
            }
            else {
                // Очищуємо поля форми
                document.forms["registerForm"].reset();
                // Закриваємо модальне вікно
                registrationModal.close();
                // Реєструємо отримані дані про користувача 
                // (для збереження стану авторизації після перезавантаження сторінки)
                setUser(data);
                // Рендеримо меню зареєстрованого користувача
                navbarRender(getUser());
                getAndShowAllProducts();
            }
        })
        .catch(err => {
            console.error(err);
        });
}

