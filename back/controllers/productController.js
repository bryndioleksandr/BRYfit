import Promise from 'bluebird';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import formidable from "formidable";
import Product from "../models/productModel.js";

// Завантажуємо змінні середовища з файлу .env
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const saveDataToDB = async (productId, data, res) => {
    // Перевіряємо чи строрювати новий рекорд в БД, чи оновити наявний
    if (productId == "") {                  //Створюємо новий рекорд БД
            await Product.create(data)
                    .then( () => res.sendStatus(200))
                    .catch(error => {
                        console.error('Error creating the new product:', error);
                    });
    }
    else {                                  //Оновлюємо наявний рекорд БД
            await Product.findByIdAndUpdate(productId, data)
                    .then( () => res.sendStatus(200))
                    .catch(error => {
                        console.error('Error updating product data:', error);

                    });
    }
}

export const createAndEditProduct = async (req, res) => {
    const productForm = formidable({
        // Конфігуруємо formidable
        multiples: true,       // Вказуємо, що буде прилітати форма з кількома полями
        keepExtensions: true,  // Вказуємо, що потрібно зберігати розширення файла
        allowEmptyFiles: true, // Вказуємо, що можна приймати дані форми без файлів (на випадок editProduct, коли не змінюємо картинку)
        minFileSize: 0         // Вказуємо, що мінімальний розмір файла може бути рівний 0 (на випадок editProduct, коли не змінюємо картинку)
    });
    try {
        productForm.parse(req, async (err, fields, files) => {
            try {
                if (err) throw err
                                
                // formidable повертає значень полів форми у вигляді масиву
                // перетворюємо їх у string
                for (const key in fields) {
                    if (Array.isArray(fields[key])) {
                        fields[key] = fields[key].join(', ');
                    }
                  }
                               
                const { productId, producCategory, productName, productVolume, productMaterial, productPrice, oldCloudinaryPublicId, oldImagePath } = fields;
                const { productImage: [{ filepath }] } = files;
                const { productImage: [{ originalFilename }] } = files;
                
                // Починаємо формувати об'єкт для запису в БД
                const productData = {
                    category: producCategory,
                    name: productName,        
                    volume: productVolume,
                    material:productMaterial,
                    price:productPrice
                };
                                  
                // Перевіряємо чи проводилася зміна картинки на клієнті
                if (!originalFilename) {
                    // Якщо картинка не мінялася - додаємо в об'єкт старі поля
                    productData.image = oldImagePath;
                    productData.cloudinaryPublicId = oldCloudinaryPublicId;
                    saveDataToDB(productId, productData, res)
                }
                else {
                    // Якщо картинка мінялася - додаємо в об'єкт нові поля
                    try {
                        cloudinary.uploader.upload(filepath, (err, resultCloudinaryImage) => {
                        if (err) { console.warn(err); }
                        productData.image = resultCloudinaryImage.url;
                        productData.cloudinaryPublicId = resultCloudinaryImage.public_id;
                        saveDataToDB(productId, productData, res); 
                        //Видаляємо стару картинку в cloudinary
                        try {
                            cloudinary.uploader.destroy(oldCloudinaryPublicId);
                        } catch (error) {
                            console.error(error);
                            res.status(401).json({ msg: 'Error deleting image from cloudinary' });
                        }
                    }) 
                    }   
                    catch (error) {
                        console.error(error);
                        res.status(401).json({ msg: 'Error saving image to cloudinary' });
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(401).json({ msg: 'Form data parsing error' });
            }
        })
    } catch (error) {
        console.error("Error parsing formData...", error);
    }
}

export const getAllProducts = async (req, res) => {
    // *** Пагінація ***
    const page = req.query.page;                    // Номер сторінки 
    const perPage = process.env.PRODUCTS_PER_PAGE;  // Кількість документів на сторінці
    const skip = (page - 1) * perPage;              // Кількість записів в БД, які потрібно пропустити
    
    // *** Сортування ***
    // Критерій сортування приходить в req.query.sort
    // можливі варіанти:
    // incPr - по зростанню ціни; 
    // decPr - по спаданню ціни;
    // incVl - по зростанню об'єму;
    // decVl - по спаданню об'єму;
    // nf - (newest first) новіші спочатку
    // of - (oldest first) старіші спочатку
    // nosort - не сортувати;
    const sortObj = {};
    switch (true) {
        case req.query.sort === 'incPr' :
            sortObj.price = 1;
            break;
        case req.query.sort === 'decPr' :
            sortObj.price = -1;
            break;
        case req.query.sort === 'incVl' :
            sortObj.volume = 1;
            break;
        case req.query.sort === 'decVl' :
            sortObj.volume = -1;
            break;
        case req.query.sort === 'nf' :
            sortObj._id = -1;
            break;
        case req.query.sort === 'of' :
            sortObj._id = 1;
            break;
        default: sortObj._id = -1;
            break;
    }

    // ***** Фільтрація і пошук *****
    const filterObj = {};
    
    // *** Фільтрація по категоріях товарів
    if (req.query.category !== 'all') filterObj.category = req.query.category;

    // *** Пошук товарів за назвою та матеріалом (case-insensitive)
    // не чутливий до регістру
    if (req.query.search) {
        filterObj.$or = [
            { name:  { $regex: new RegExp(req.query.search, "i") } },
            { material: { $regex: new RegExp(req.query.search, "i") } }
          ]
    };
    
    
    Promise.all([
        // Визначаємо кількість продуктів, що відповідають критеріям (count)
        Product.countDocuments(filterObj).exec(),
        // вибираємо  продукти, що відповідають критеріям (items)
        Product.find(filterObj).limit(perPage).skip(skip).sort(sortObj).populate('category').exec()
    ]).spread((count, items ) => { 
        // метод spread пакету bluebird допомагає зручно працювати з результатами промісів
        // віддаємо кількість сторінок для перемальовування пагінації
        const pageCount = Math.ceil(count / perPage);
        res.status(200).json( { items: items, pageCount: pageCount });

    }, (err) => {
        console.warn('Error in retrieving product list: ', err);
        res.status(401).json({ msg: 'Error in retrieving product list:' });
    });
}

export const deleteProduct = async (req, res) => {
    try {
        cloudinary.uploader.destroy(req.body.cloudinaryPublicId);
    } catch (error) {
        console.error(error);
    }
    
    Product.findByIdAndDelete(req.body._id)
    .then(() => {
        res.sendStatus(200);
    })
    .catch((err) => {
      console.error('Removing product error...:', err);
    });
}
    
    
 

