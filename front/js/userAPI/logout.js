import { backURL, clearStorage, getUser } from "../config.js";
import { navbarRender } from "../navbar.js";
import { btnRender, getAndShowAllProducts } from "../productAPI/products.js";

export const userLogout = async() => {
    return fetch(`${backURL}/user/logout`, {
        method: 'GET',
        mode: 'cors', 
        credentials: 'include'                 // Don't forget to specify this if you need cookies
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            clearStorage();
            navbarRender(getUser());
            btnRender();
            getAndShowAllProducts();
            })
        .catch(err => console.error(err));
}