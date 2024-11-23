import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenAndSetcookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });

  res.cookie('jwt-netflix', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15 days in ms
    httpOnly: true, //prevent XSS attacks cross-site scripting attaks, make it not be accessed by JS
    sameSite: 'strict',
    secure: ENV_VARS.NODE_ENV !== 'development', //HTTP = FALSE | HTTPS = TRUE
  });

  return token;
};
