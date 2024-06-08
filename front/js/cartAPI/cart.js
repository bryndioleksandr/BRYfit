import { attachEventHandler, backURL, getUser, setUser } from "../config.js";
import { dropDownClose } from "../modals/main.js";
import { orderModal } from "../modals/orderModal.js";
import { navbarRender } from "../navbar.js";
import { hidePagination } from "../pagination.js";
import { getAndShowAllProducts } from "../productAPI/products.js";
import { cartCardRender } from "./cartCard.js";

export const addToCart = async (product) => {
    const user = getUser();
    const existsProductIndex = user.cart.findIndex(item => item.product._id === product._id)
    
    if (existsProductIndex < 0) {
        user.cart.push({product, count: 1})
    } else {
        user.cart[existsProductIndex].count += 1
    }
    setUser(user);
    navbarRender(user);
    renderCalcCount();
    updateCartInDB(getUser());
}

// Рендер числа товарів на піктограмі корзини в navbar
export const renderCalcCount = async () => {
    const user = getUser();
    if (!user) return;
    let calcCoutProducts = 0;
    
    if (user && !user.isAdmin) {
        if (user.cart.length > 0) {
            user.cart.forEach(item => {
                calcCoutProducts += item.count;
            });
            
            document.getElementById('cartIconCount').innerText = calcCoutProducts;
            document.getElementById('cartIconCount').style.display = 'block';
            
        } else {
            document.getElementById('cartIconCount').style.display = 'none';
        }
    }
}

export const cartRender =  () => {
    dropDownClose();
    hidePagination();
        const dataContainer= document.querySelector('.data-container');
        dataContainer.innerHTML = ``;
        const cartContainer = document.createElement('div');
        cartContainer.classList.add('cart-container')
        dataContainer.appendChild(cartContainer);
        
        const user = getUser();
        if (user.cart.length) {
            // Рендер карточок товарів в корзині
            user.cart.forEach( (item, index) => cartCardRender(item, index));

            // Виведення загальної ціни корзини
            const totalCartPrice = document.createElement('div');
            totalCartPrice.classList.add('cart-order-price')
            const orderPrice = user.cart.reduce((accumulator, item) => {
                return accumulator + item.count * item.product.price;
            }, 0);
            totalCartPrice.innerHTML = `<div class="cart-order-price-label"> Order price:</div>
                                        <div class="cart-order-price-text"> ${orderPrice} &#x20b4</div>`
            cartContainer.appendChild(totalCartPrice);

            // Кнопка оформлення замовлення
            const orderButton = document.createElement('div');
            orderButton.classList.add('cart-order-button-container');
            orderButton.innerHTML = `<button class="btn btn-secondary" id="orderCompleteBtn">Complete the order</button>`;
            cartContainer.appendChild(orderButton);
            attachEventHandler('orderCompleteBtn', 'click', () => { orderModal.open() })
        } else {
            const emptyCartMsg = document.createElement('div');
            emptyCartMsg.classList.add('cart-empty-message');
            emptyCartMsg.innerHTML = `<button class="btn btn-secondary" id="orderGoShopingBtn">Cart is empty. Go shopping ...</button>`;
            cartContainer.appendChild(emptyCartMsg);
            attachEventHandler('orderGoShopingBtn', 'click', () => { getAndShowAllProducts() })
        }
}

export const updateCartInDB = async (user) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${backURL}/user/cart`, {
                method: 'PATCH',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',   
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json()) // Парсимо [object Response] 
            .then(user => {                    // Парсимо [object Promise]
                resolve(user);
            })                                         
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}; 