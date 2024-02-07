// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');
const productRouter = require('./routes/products');
const singleproductRouter = require('./routes/singleproduct');
const addproductRouter = require('./routes/add-product');
const protectedRouter = require('./routes/protected');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const userRouter = require('./routes/user');
const app = express();


// Middleware
app.use(bodyParser.json());

// Route for products
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.get('/', productRouter);
app.get('/:productId', singleproductRouter);
app.post('/add-product', addproductRouter);
app.post('/protected', protectedRouter);
app.get('/user', userRouter);


app.use(cors());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
