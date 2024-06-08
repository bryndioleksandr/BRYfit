import { attachEventHandler, backURL, getUser } from "../config.js";
import { renderOrders } from "./order.js";

export const  orderCardRender = (order) => {
    // console.log(order);
    // Перетворюємо формат часу створення ордеру
    // у звичний для України вигляд
    const isoDate = order.createdAt;
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}  ${hours}:${minutes}:${seconds}`;
    // Формуємо карточку
    const orderContainer = document.querySelector('.order-container');
    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');
    orderCard.innerHTML = `
    <div class="order-id-parent">
        <div class="order-id">
            <div class="order-id-item"><b>Order ID:</b> ${order._id} </div>
            <div class="order-id-item"><b>from</b> ${formattedDate}</div>
            <div class="order-id-item"><b>Status:</b> <span id="order-status-${order._id}" class="order-status-text">${order.status}</span></div>
        </div>
    </div>
    <div class="order-info">
        <div class="order-resep-info">
            <div class="order-resep-info-item order-name"><b>Recipient's name:</b> <br>${order.name} </div>
            <div class="order-resep-info-item order-address"><b>Delivery address:</b> <br> ${order.address}</div>
            <div class="order-status-container-${order._id}"></div>
        </div>
        
    </div>
    <div class="accordion" id="accordion${order._id}">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accitem${order._id}" aria-expanded="false" aria-controls="accitem${order._id}">
                    Order details
                </button>
            </h2>
            <div id="accitem${order._id}" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordion${order._id}">
            <div class="accordion-body" id="${order._id}-cart">
                
            </div>
        </div>
    </div>`;
    orderContainer.appendChild(orderCard);
    // Зміна кольору статусу ордера
    const status = document.getElementById(`order-status-${order._id}`);
    switch (true) {
        case status.innerText === 'pending':
            status.style.color = '#f39c12'; /* Оранжевий */
            break;
        case status.innerText === 'shipped':
            status.style.color = '#3498db'; /* Синій */
            break;
        case status.innerText === 'completed':
            status.style.color = '#2ecc71'; /* Зелений */
            break;
        case status.innerText === 'canceled':
            status.style.color = '#e74c3c'; /* Червоний */
            break;
    }
    
    // Рендеримо для адміністратора функціонал для зміни статусу замовлення
    const user = getUser();
    if (user.isAdmin) {
        const orderStatusManage = document.createElement('div');
        orderStatusManage.classList.add(`order-status-manage-container`);
        orderStatusManage.innerHTML = `
            <label class="order-status-select-item-label" for="order-status-select-${order._id}"><b>Change status: </b></label>
            <div class="order-status-options">
                <select class="form-select form-select-sm order-status-select-item-select" name="status" id="order-status-select-${order._id}">
                    <option value="pending">pending</option>
                    <option value="shipped">shipped</option>
                    <option value="completed">completed</option>
                    <option value="canceled">canceled</option>
                </select>
                <button class="btn btn-outline-primary btn-sm order-status-select-item-btm" id="orderStatusChange${order._id}">Apply</button>
            </div>
        `;
        document.querySelector(`.order-status-container-${order._id}`).appendChild(orderStatusManage);
        // Навішуємо обробник
        attachEventHandler(`orderStatusChange${order._id}`, 'click', () => { orderStatusChange(order._id) })

        // Сетимо статус замовлення у випадаючому списку
        document.getElementById(`order-status-select-${order._id}`).value = order.status;
    }
    
    // Заповнюємо акордеон (деталі орера)
    // Вибираємо акордеон
    const orderDetails = document.getElementById(`${order._id}-cart`);
    orderDetails.innerHTML =``;
    // Створюємо контейнер для відмальовування деталей замовлення
    const cartContainer = document.createElement('div');
    cartContainer.classList.add(`order-cart-container`);
    cartContainer.classList.add(`order-${order._id}`);
    orderDetails.appendChild(cartContainer);
    
    // Рендер карточок товарів корзини замовлення
    order.cart.forEach( (item) => orderCartItemRender(item, order));

    // Виведення загальної ціни корзини
    const totalCartPrice = document.createElement('div');
    totalCartPrice.classList.add('cart-order-price')
    const orderPrice = order.cart.reduce((accumulator, item) => {
        return accumulator + item.count * item.product.price;
    }, 0);
    totalCartPrice.innerHTML = `<div class="cart-order-price-label"> Order price:</div>
                                <div class="cart-order-price-text"> ${orderPrice} &#x20b4</div>`
    cartContainer.appendChild(totalCartPrice);
  
}

function orderCartItemRender(item, order) {
    const cartContainer = document.querySelector(`.order-cart-container.order-${order._id}`);
    const cartItem = document.createElement('div');
    cartItem.classList.add('order-cart-card');
    cartItem.innerHTML = `  <div class="cart-img-container">
                                <div class="cart-product-category">
                                    <div class="cart-product-category-text">${item.product.category.name}</div>
                                </div>
                                <div> <img src='${item.product.image}' class="cart-product-img"> </div>
                            </div>

                            <div class="cart-product-info order-details">
                                <div class="cart-product-name">${item.product.name}</div>
                                <div class="cart-product-material">${item.product.producer}</div>
                                <div class="cart-product-volume">${item.product.sizes} mm</div>
                                <div class="cart-product-price">${item.product.price} &#x20b4 / pc</div>
                            </div>

                            <div class="cart-item-price">${item.count*item.product.price} &#x20b4
                            </div>`;
    cartContainer.appendChild(cartItem);
}

async function orderStatusChange(id) {
    const reqBody = {
        status: document.getElementById(`order-status-select-${id}`).value
    }
    return new Promise((resolve, reject) => {
        try {
            fetch(`${backURL}/order/${id}`, {
                method: 'PATCH',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',   
                },
                body: JSON.stringify(reqBody)
            })
            .then(response => response.json())    // Парсимо [object Response] 
            .then(msg => {                        // Парсимо [object Promise]
                console.log(msg);
                renderOrders();
                resolve();
            })                                         
        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

