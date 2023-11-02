import { Readable } from 'stream';
import { RegisterUserCSV } from '../types/user';
import csv from 'csv-parser';

export const processCSV = async (file: Express.Multer.File) => {
  const stream = Readable.from(file.buffer);
  const result: RegisterUserCSV[] = [];

  await stream.pipe(csv()).on('data', (user) => {
    result.push(user);
  });

  return result;
};
