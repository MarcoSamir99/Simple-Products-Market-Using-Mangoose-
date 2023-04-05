const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); 
var methodOverride = require('method-override');

const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/farm', { useNewUrlParser: true })
.then (() => {     
   console.log('Mongo connection open')
})
.catch(err => {
    console.log('oh no mongo connection error!!!!!!!!!!')
    console.log(err)
    }) ;

app.set('views', path.join(__dirname, 'views' ));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));  // used to show data coming from the form in req.body
app.use(methodOverride('_method'));               // used in put and patch methods for updating data in mongoose

const categories = [ 'fruit', 'vegetable', 'dairy', 'Baked Products'];


app.get("/products", async (req, res) => {
   const { category } =  req.query;
   if(category) {
    const products = await Product.find({category})
    res.render('products/index', { products, category })
   } else {
    const products = await Product.find({});
    res.render('products/index', { products, category: 'All' })
   }
   
})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect("/products")
    
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/show',{ product } )
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true })
    console.log(req.body);
    res.redirect(`/products/${product._id}`);
})
 
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products')
} )

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000")
}) 