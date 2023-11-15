import CryptoJS from 'crypto-js';
import { generate } from 'generate-password';
import { AuthUser } from '../types/user';
import jwt from 'jsonwebtoken';

export const generatePassword = () =>
  CryptoJS.AES.encrypt(
    generate({
      length: 10,
      numbers: true,
    }),
    `${process.env.SECRET_KEY_AES}`
  ).toString();

export const generateAccessToken = (user: AuthUser) => {
  return jwt.sign(user, `${process.env.JWT_SECRET_KEY}`, { expiresIn: 300 });
};

export const hashPassword = (password: string) => {
  return CryptoJS.AES.encrypt(password, `${process.env.SECRET_KEY_AES}`).toString();
};
