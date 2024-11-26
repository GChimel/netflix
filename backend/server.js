import express from 'express';

import authRoutes from './routes/auth-route.js';
import movieRoutes from './routes/movie-route.js';

import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';

const PORT = ENV_VARS.PORT;
const app = express();

app.use(express.json()); // Allow parse json requests

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movie', movieRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
