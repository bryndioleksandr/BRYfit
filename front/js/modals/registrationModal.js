import { attachEventHandler } from "../config.js";
import { userRegistetion } from "../userAPI/register.js";
import { loginModal } from "./loginModal.js";
import { CustomModal } from "./main.js";
//
// ********* Модальне вікно для реєстрації ************
//
const registrationModalTitle = `Registration`;
const registrationModalContent = `<form name="registerForm" method="post">
                                <table class="form-table">
                                    <tr>
                                        <td class="form-label"><label for="userRegName">Name:</label> </td>
                                        <td class="form-input"><input type="text" name="userRegName" id="userRegName" class="form-control" required></td>
                                    </tr>    
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror"></td>
                                    </tr>
                                    <tr class="form-padding">
                                        <td class="form-label"><label for="userRegEmail">Email:</label> </td>
                                        <td class="form-input"><input type="email" name="userRegEmail" id="userRegEmail" class="form-control" required></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror" id="registerEmailError"></td>
                                    </tr>
                                    <tr>
                                        <td class="form-label"><label for="userRegPassword">Password:</label> </td>
                                        <td class="form-input"><input type="password" name="userRegPassword" id="userRegPassword" class="form-control" minlength="6" required></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror" id="registerEmailError"></td>
                                    </tr>
                                    <tr>
                                        <td class="form-label"><label for="userRegConfirmPassword">Password confirm:</label> </td>
                                        <td class="form-input"><input type="password" name="userRegConfirmPassword" id="userRegConfirmPassword" class="form-control" minlength="6" required></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror" id="registerPasswordError"></td>
                                    </tr>
                                    
                                </table>
                                <div class="modal-form-footer">
                                    <input type="submit" class="btn btn-success" id="submitRegistrationtBtn" value="Submit">
                                </div>
                            </form>`  ;

const registrationModalFooter =`<div class="login-footer">
                                    <div>Already member? </div>
                                    <div class="switch-link" id="switchToLoginPage"> LogIn </div>
                                </div>`;
export const registrationModal = new CustomModal('rgstr', registrationModalTitle, registrationModalContent, registrationModalFooter);

registrationModal.create();

export const switchToLogin = () => {
    registrationModal.close();
    loginModal.open();
}

attachEventHandler('switchToLoginPage', 'click', switchToLogin);

// Функція валідації Email
export const validateEmail = () => {
    const email = document.getElementById('userRegEmail').value;
    return new Promise((resolve, reject) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
      if (!emailRegex.test(email)) {
        document.getElementById('registerEmailError').innerText = 'Wrong email format';
        // reject('Невірний формат email');
      } else {
        // Якщо email валідний, відправляємо успішний результат
        resolve();
      }
    });
}

// Функція валідації для порівняння введеного паролю та підтвердження паролю
export const validatePassword = () =>  {
    const password = document.getElementById('userRegPassword').value;
    const confirmPassword = document.getElementById('userRegConfirmPassword').value;
    return new Promise((resolve, reject) => {
      if (password !== confirmPassword) {
        document.getElementById('registerPasswordError').innerText = "Passwords don't match";
        // reject('Паролі не співпадають');
      } else {
        // Якщо паролі проходять валідацію, відправляємо успішний результат
        resolve();
      }
    });
  }

/// Навішуємо обробники подій
document.forms["registerForm"].addEventListener ('submit', async (e) => {
    e.preventDefault();
    try {
        await validateEmail();
        await validatePassword();
        await userRegistetion();
      } catch (error) {
        console.log(error); // Помилка валідації пароля
      }
})

// При втраті фокуса поля  валідуємо email
userRegEmail.addEventListener('blur', () => {
    validateEmail();
})
// Очищуємо повідомлення про помилки коли поля форми у фокусі 
userRegEmail.addEventListener('focus', () => {
    document.getElementById('registerEmailError').innerText = '';
});
userRegPassword.addEventListener('focus', () => {
    document.getElementById('registerPasswordError').innerText = '';
});
userRegConfirmPassword.addEventListener('focus', () => {
    document.getElementById('registerPasswordError').innerText = '';
})