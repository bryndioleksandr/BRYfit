import { addToCart } from "../cartAPI/cart.js";
import { attachEventHandler, getUser } from "../config.js";
import { popUp } from "../popup.js";
import { editProduct, removeProduct } from "./products.js";

export const productCardRender = (product) => {
    const { category } = product;
    const productCard = document.createElement("div");
    productCard.classList.add("product");

    const productCardHTML = `
        <div class="product-data" style="background-image: url('${product.image}')">
            <div class="product-category"><div class="product-category-text">${category.name}</div></div>
            <div class="product-name">${product.name}</div>
            <div><span class="product-price">${product.price} &#x20b4</span></div>
        </div>
        <div class="card-back">
            <div class="product-text">Color: <span class="product-color">${product.color}</span></div>
            <div class="product-text">Producer: <span class="product-material">${product.producer}</span></div>
            <div class="product-text">Sizes: <span class="product-volume">${product.sizes}</span> mm</div>
            <div class="product-footer">
                ${getUser() ? `
                    ${getUser().isAdmin ? `
                        <div class="product-manage-btns">
                            <div class="fas fa-edit product-btn" id='editProduct${product._id}'></div>
                            <div class="fa-solid fa-trash-can product-btn" id="removeProduct${product._id}"></div>
                        </div>
                    ` : `
                        <div class="fa fa-shopping-cart product-cart-btn" id="addToCart${product._id}"></div>
                    `}
                ` : `
                    <div class="fa fa-shopping-cart product-cart-btn" id='popUp${product._id}'></div>
                `}
            </div>
        </div>
    `;

    productCard.innerHTML = productCardHTML;
    document.querySelector(".data-container").appendChild(productCard);

    attachEventHandler(`popUp${product._id}`, 'click', () => { popUp('Please log in', 'danger') });
    attachEventHandler(`addToCart${product._id}`, 'click', () => { addToCart(product) });
    attachEventHandler(`editProduct${product._id}`, 'click', () => { editProduct(product) });
    attachEventHandler(`removeProduct${product._id}`, 'click', () => { removeProduct(product) });
}
