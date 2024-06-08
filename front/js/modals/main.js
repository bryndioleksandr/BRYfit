//Визначаємо клас, на основі якого будемо генерувати модальні вікна
export class CustomModal {
    constructor(id, title, content, footer) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.footer = footer;        
    }

    // modalContaiter = document.querySelector(".modal-container");
    // modalOverlay = document.createElement("div");
    
    create(name) {
        const modalContaiter = document.querySelector(".modal-container");
        const modal = document.createElement("div");
        // this.modalOverlay = document.createElement("div");
        modal.id = this.id;
        modal.classList.add("modal-overlay");
        modal.classList.add("modal-close");
        modal.dataset.close = "true";
        // modalOverlay.setAttribute("id", `modalOverlay-${name}`);
        modal.innerHTML = `
        <div class="modal-window">
            <div class="modal-header">
                <span class="modal-title" id="title-${this.id}">${this.title}</span>
                <span class="modal-close-btn" data-close="true">&times;</span>
            </div>
            <div class="modal-content">
            ${this.content}
            </div>
            <div class="modal-footer">
            ${this.footer}
            </div>
         </div>`
        
         // Навішуємо обробник для закривання
        modal.addEventListener('click', event => {
            if (event.target.dataset.close) {
                this.close();
            }
        })
        
         // Розміщаємо модалку
        modalContaiter.appendChild(modal);
    }

    open() {
        const modal = document.getElementById(this.id)
        if (modal) {
            modal.classList.remove("modal-close");
            modal.classList.add("modal-open");
        }
        
    }

    close() {
        const modal = document.getElementById(this.id)
        if (modal) {
            modal.classList.remove("modal-open");
            modal.classList.add("modal-close");
        }
        
        const formImage = document.getElementById('formImage');
        if (formImage) {
            formImage.removeAttribute("src");
        }
        
        //Закриваємо випадаюче меню в адаптиві при закриванні модального вікна
        dropDownClose();
    }
}

// Закривання випадаючого меню в адаптиві при закриванні модального вікна
export const dropDownClose = () =>  {
    const navBar = document.getElementById("n_bar");
    if (navBar) {
        navBar.classList.remove('show');
    }
    
}

