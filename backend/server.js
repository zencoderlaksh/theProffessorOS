import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API Routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
