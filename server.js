const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.FRONT_URL,  // Allow requests from this origin
    methods: ['GET', 'POST'],         // Allow specific methods
    allowedHeaders: ['Content-Type'],  // Allow Content-Type header
  }));
// Middleware to parse JSON bodies
app.use(express.json());

// Route to send a GET request to an external API with Basic Authentication
app.get('/api/products', async (req, res) => {
    const username = 'sfuDhrCEPTXQurlSeoIfpmSFtJrGaP/kPAW3qxwL+9w=';  // Replace with your username
    const password = 'rbs5AkATAMcsRYUcO52qVdeCVa9G0cN2cHA4fUD64sU=';  // Replace with your password
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const apiResponse = await axios.get('https://api.stockandbuy.com/v1/products?expand=images&expand=variants', {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        res.json(apiResponse.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
});

// Route to send a POST request to an external API with Basic Authentication
app.post('/api/orders', async (req, res) => {
    const username = 'sfuDhrCEPTXQurlSeoIfpmSFtJrGaP/kPAW3qxwL+9w=';  // Replace with your username
    const password = 'rbs5AkATAMcsRYUcO52qVdeCVa9G0cN2cHA4fUD64sU=';  // Replace with your password
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    console.log("request : ",req)
    const dataToSend = req.body;
    console.log(dataToSend);
    res.json(dataToSend);
   /* try {
        const apiResponse = await axios.post('https://api.stockandbuy.com/v1/sales', dataToSend, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            }
        });
        res.json(apiResponse.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to send data to external API' });
    }*/
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
