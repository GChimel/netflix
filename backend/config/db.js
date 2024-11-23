import mongoose from 'mongoose';
import { ENV_VARS } from './envVars.js';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log('MongoDB connected: ', connection.connection.host);
  } catch (error) {
    console.log('Error connecting to MongoDB', error);
    process.exit(1); //1 means there was an err, 0 means success
  }
};
