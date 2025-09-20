const express = require('express');
const cors = require('cors'); // Import cors
const app = express();
const port = 3001; // Port for the backend server

// Middleware
app.use(cors()); // Enable All CORS Requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Shiv Accounts API is running!');
});

// API Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
