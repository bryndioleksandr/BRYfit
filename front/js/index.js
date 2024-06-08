import { getAllCategoriesFromDB } from './categoryAPI/category.js';
import { getUser } from './config.js';
import { renderFilterCategoriesOptions, renderFiltration } from './filter.js';
import { navbarRender } from './navbar.js';
import { getAndShowAllProducts } from './productAPI/products.js';
import './userAPI/refreshToken.js';

const app = async () => {
    navbarRender(getUser());
    renderFiltration();
    await getAllCategoriesFromDB()
            .then( async categories => {
                renderFilterCategoriesOptions(categories);
                await getAndShowAllProducts();
            })
}
// Запускаємо застосунок
app();




