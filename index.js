const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

require('./db'); // Connect to MongoDB

const userRoutes = require('./Routes/users-routes');
const productRoutes = require('./Routes/product-routes'); // ✅ Import product routes
app.use(cors()); // ✅ Enable CORS
app.use(express.json()); // ✅ Parse JSON

app.use('/api/users', userRoutes); // ✅ Mount routes
app.use('/api/products',productRoutes ); // ✅ Mount product routes
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});