const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000;

const productRouter = require('./routes/product');

// Enable CORS for all origins (adjust as needed)
app.use(cors());

app.use(express.json());
app.use('/product', productRouter);

// app.get('/', (req, res) => {
//   res.send('<h1>Node.js CRUD API</h1> <h4>Message: Success</h4><p>Version: 1.0</p>');
// });

// Route handler for the root endpoint
app.get('/', (req, res) => {
  const apiInfo = {
    message: 'Welcome to the Node.js CRUD API',
    version: '1.0',
    routes: {
      products: '/product', // Endpoint for managing products
      health: '/health' // Endpoint for health check
    }
  };
  res.json(apiInfo);
});

app.get('/health', (req, res) => {
  res.send();
});

app.listen(port, () => {
  console.log('Demo app is up and listening to port: ' + port);
});
