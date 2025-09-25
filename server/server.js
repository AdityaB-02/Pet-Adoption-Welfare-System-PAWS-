// In server/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/pets', require('./routes/pets'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shelters', require('./routes/shelters'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});