import { attachEventHandler, setPage } from "./config.js";
import { getAndShowAllProducts } from "./productAPI/products.js";

export const renderFiltration = () => {
    const filterContainer = document.querySelector('.filter-container');
    filterContainer.innerHTML  =`<form class="filter-form">
                <div class="filter-category">
                    <select class="form-select" id="filter-category" >
                    </select>
                </div>
                <div class="filter-search">
                    <input class="form-control" id="filter-search" type="text" placeholder="-- search product --" >
                </div>
                <div class="filter-sort">
                    <select class="form-select" id="filter-sort">
                        <option selected value="nosort">-- sort products (Don't sort) --</option>
                        <option value="incPr">by increasing price</option>
                        <option value="decPr">by decreasing price</option>
                        <option value="incVl">by increasing size</option>
                        <option value="decVl">by decreasing size</option>
                        <option value="nf">newest first</option>
                        <option value="of">oldest first</option>
                      </select>
                </div>
            </form>`;
    // Навішуємо обробники
    // Фільтація по категоріях
    attachEventHandler('filter-category', 'change', filtration);
    // Сортуавння
    attachEventHandler('filter-sort', 'change', filtration);
    // Пошук
    attachEventHandler('filter-search', 'input', filtration);
}

export const  renderFilterCategoriesOptions = (categories) => {
    // Вибираємо відповідний select з блоку фільтрації i очищуємо його
    const filterCategory = document.getElementById('filter-category');
    filterCategory.innerHTML = ``;
    // Додаємо в них опцію по замовчуванню 
    // <option disabled selected value> -- select a category -- </option>
    const defaultProductCategoryOption = document.createElement('option');
    // defaultProductCategoryOption.setAttribute("disabled", "");
    defaultProductCategoryOption.setAttribute("selected", "");
    defaultProductCategoryOption.setAttribute("value", "all");
    defaultProductCategoryOption.innerText = ` -- select a category (All categories) -- `;
    filterCategory.appendChild(defaultProductCategoryOption);
    // Вибираємо категорії товарів з LS
    // const categoryArr = getCategories();
    categories.forEach(category => {
                const categoryOption = document.createElement('option');
                categoryOption.value = category._id;
                categoryOption.innerText = `${category.name}`;
                filterCategory.appendChild(categoryOption);
    });
}

// При будь-якій фільтрації - стаємо на 1-шу сторінку
const filtration = async () => {
    setPage(1);
    await getAndShowAllProducts();
}
