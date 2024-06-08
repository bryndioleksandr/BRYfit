import { CustomModal } from "./main.js";

//
// ********* Модалки для роботи з категоріми продуктів
//
// ********* Модальне вікно для створення категорії продуктів ************
// 
const createCatgoryModalTitle = `Create category`;
const createCatgoryModalContent =`<form name="createCategoryForm" id="createCategoryForm">
        <table class="form-table">
            <tr>
                <td class="form-label"><label for="createCategoryName">Category name:</label> </td>
                <td class="form-input"><input type="text" name="createCategoryName" id="createCategoryName" class="form-control touppercase" required></td>
            </tr>
            <tr>
                <td></td>
                <td class="form-email-eror" id="createCategoryNameError" onfocus="createCategoryNameErrorHandler"></td>
            </tr>
        </table>
        <div class="modal-form-footer">
            <input type="submit" class="btn btn-success" id="submitCreateCategoryBtn" value="Create">
        </div>
    </form>`;    
const createCatgoryModalFooter =``;
export const createCatgoryModal = new CustomModal('crCtg', createCatgoryModalTitle, createCatgoryModalContent, createCatgoryModalFooter);
createCatgoryModal.create();


// ********* Модальне вікно для редагування категорії продуктів ************
const editCatgoryModalTitle = `Edit category`;
const editCatgoryModalContent = `<form name="editCategoryForm" id="editCategoryForm" >
        <input type="hidden" id="editCategoryId" name="editCategoryId">
        <table class="form-table">
            <tr>
                <td class="form-label"><label for="editCategoryName">Category name:</label> </td>
                <td class="form-input"><input type="text" name="editCategoryName" id="editCategoryName" class="form-control touppercase" required></td>
            </tr>
            <tr>
                <td></td>
                <td class="form-email-eror" id="editCategoryNameError" onfocus="editCategoryNameErrorHandler"></td>
            </tr>
        </table>
        <div class="modal-form-footer">
            <input type="submit" class="btn btn-success" id="submitEditCategoryBtn" value="Confirm">
        </div>
    </form>`    
const editCatgoryModalFooter =``;
export const editCatgoryModal = new CustomModal('edCtg', editCatgoryModalTitle, editCatgoryModalContent, editCatgoryModalFooter);
editCatgoryModal.create('edCtg');
