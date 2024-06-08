import { attachEventHandler } from "../config.js";
import { userLogin } from "../userAPI/login.js";
import { CustomModal } from "./main.js";
import { registrationModal } from "./registrationModal.js";

//
// ********* Модальне вікно для авторизації ************
//
const loginModalTitle = `LogIn`;
const loginModalContent = `<form name="loginForm">
                                <table class="form-table">
                                    <tr>
                                        <td class="form-label"><label for="userLoginEmail">Email:</label> </td>
                                        <td class="form-input"><input type="text" name="userLoginEmail" id="userLoginEmail" class="form-control" required></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror" id="loginEmailError"></td>
                                    </tr>
                                    <tr>
                                        <td class="form-label"><label for="userLoginPassword">Password:</label> </td>
                                        <td class="form-input"><input type="password" name="userLoginPassword" id="userLoginPassword" class="form-control" required></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td class="form-email-eror" id="loginPasswordError"></td>
                                    </tr>
                                    
                                </table>
                                <div class="modal-form-footer">
                                    <input type="submit" class="btn btn-success" id="submitLoginBtn" value="LogIn">
                                </div>
                            </form>`  ;

const loginModalFooter =`<div class="login-footer">
                            <div>Not a member? </div>
                            <div class="switch-link" id="switchToRegistrationPage"> SignUp </div>
                        </div>`;
export const loginModal = new CustomModal('lgn', loginModalTitle, loginModalContent, loginModalFooter);

loginModal.create();

export const switchToRegistration = () => {
    loginModal.close();
    document.getElementById('registerEmailError').innerText = '';
    registrationModal.open();
}

attachEventHandler('switchToRegistrationPage', 'click', switchToRegistration);

// Функції валідації Email
export const validateLoginEmail = async () => {
    const email = document.getElementById('userLoginEmail').value;
    return new Promise((resolve, reject) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
      if (!emailRegex.test(email)) {
        document.getElementById('loginEmailError').innerText = 'Невірний формат email';
        // reject('Невірний формат email');
      } else {
        // Перевіряємо чи email має правильний формат 
        resolve();
      }
    });
}

// LogIn
document.forms["loginForm"].addEventListener ('submit', async (e) => {
    e.preventDefault();
    try {
        await validateLoginEmail();
        await userLogin();
        
      } catch (error) {
        console.log(error); 
      }

})
// При втраті фокуса поля  валідуємо email
userLoginEmail.addEventListener('blur', () => {
    validateLoginEmail();
})
userLoginEmail.addEventListener('focus', () => {
    document.getElementById('loginEmailError').innerText = '';
});