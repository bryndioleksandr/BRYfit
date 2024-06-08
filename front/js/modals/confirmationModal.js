import { CustomModal } from "./main.js";
//
// ********* Модальне вікно для підтвердження видалення продукту ************
//
const confirmModalTitle = `Removal confirmation`;
const confirmModalContent = `<div class="confirmation-message"></div> `;
const confirmModalFooter =`<div class="confirmation-footer">
                                <input type="submit" class="btn btn-danger" id="removeProductBtn" value="Remove">
                                <input type="reset" class="btn btn-success" id="cancelProductBtn" data-close="true" value="Cancel">
                            </div>`;
export const confirmModal = new CustomModal("cfm", confirmModalTitle, confirmModalContent, confirmModalFooter);

confirmModal.create();

// Функція, яка повертає проміс, який буде вирішений (resolved) 
// при натисканні кнопки Remove у модалці Removal confirmation
export const waitForRemoveButtonPress = async () => {
    // Кнопка Remove у модалці Removal confirmation
    const removeProductBtn = document.getElementById('removeProductBtn');
        return new Promise((resolve, reject) => {
            removeProductBtn.addEventListener('click', () => {
            resolve();                  // Вирішити проміс, коли кнопка буде натиснута
        });
    });
}