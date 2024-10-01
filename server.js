require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONT_URL,  // Allow requests from this origin
    methods: ['GET', 'POST'],       // Allow specific methods
    allowedHeaders: ['Content-Type'],  // Allow Content-Type header
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Function to fetch products for a given page
async function fetchProductsPage(authHeader, page = 1) {
    const url = `https://api.stockandbuy.com/v1/products?expand=images&expand=variants&page=${page}`;
    const response = await axios.get(url, {
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

// Route to fetch all products from all pages
app.get('/api/products', async (req, res) => {
    const username = 'sfuDhrCEPTXQurlSeoIfpmSFtJrGaP/kPAW3qxwL+9w=';  // Replace with your username
    const password = 'rbs5AkATAMcsRYUcO52qVdeCVa9G0cN2cHA4fUD64sU=';  // Replace with your password
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const totalPages = 5;  // Assume there are 24 pages
        let allProducts = [];

        // Fetch all pages of products
        for (let page = 0; page <= totalPages; page++) {
            const productsPage = await fetchProductsPage(authHeader, page);
            allProducts = allProducts.concat(productsPage);
        }

        return res.json(allProducts);  // Return combined products
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        if (!res.headersSent) {  // Check if headers have already been sent
            return res.status(500).json({ error: 'Failed to fetch data from external API' });
        }
    }
});

// Route to send a POST request to an external API with Basic Authentication
app.post('/api/orders', async (req, res) => {
    const username = 'sfuDhrCEPTXQurlSeoIfpmSFtJrGaP/kPAW3qxwL+9w=';  // Replace with your username
    const password = 'rbs5AkATAMcsRYUcO52qVdeCVa9G0cN2cHA4fUD64sU=';  // Replace with your password
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    const dataToSend = req.body;
    console.log('Data to send:', dataToSend);
    
    try {
        const apiResponse = await axios.post('https://api.stockandbuy.com/v1/sales', dataToSend, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        return res.json(apiResponse.data); // Ensure only one response
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        if (!res.headersSent) { // Check if headers have already been sent
            return res.status(500).json({ error: 'Failed to send data to external API' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
