import slugify from "slugify";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const createCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        // Для перевірки унікальност категорії робимо її slug
        const categorySlug = slugify(categoryName, {
            lower: true,  // Перетворити рядок на нижній регістр
            strict: true  // Видалити спеціальні символи
            })
        // Перевіряємо по slug чи існує вже така категорія товарів
        const catExists = await Category.exists( {slug: categorySlug} );
        if (catExists) return res.status(400).json({msg: "This category already exists"})   
        
        // Якщо не існує - створюємо новий рекорд в БД
        const newCategory = new Category( {
            name: categoryName,
            slug: categorySlug
        })
        
        await newCategory.save()
        .then( async () => {
            // Вибираємо усі категорії та відправляємо на клієнт
            const allCategories = await Category.find();
            // Відправляємо їх на клієнт
            res.status(200).json(allCategories);
            // console.log(allCategories);
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export const getCategories = async (req, res) => {
    try {
        // Вибираємо усі категорії та відправляємо на клієнт
        const allCategories = await Category.find();
        // Відправляємо їх на клієнт
        res.status(200).json(allCategories);
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export const removeCategory = async (req, res) => {
    const category_id = req.params.id;
    try {
        await Product.deleteMany({category: category_id });
        await Category.findByIdAndDelete(category_id);
        res.status(200).json({msg: "Category and of its products successfully deleted"});
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
}

export const editCategory = async (req, res) => {
    const { categoryId,  categoryName } = req.body;
    try {
        await Category.findByIdAndUpdate (categoryId, {name: categoryName});
        res.status(200).json({message: "Category successfully updated"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: error.message})
    }
}