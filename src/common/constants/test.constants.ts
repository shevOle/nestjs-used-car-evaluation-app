import { randomBytes } from 'crypto';
import { User } from 'src/db/entities/user.entity';
import * as dotenv from '@nestjs/config/node_modules/dotenv';

dotenv.config();
export const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_PASSWORD,
} = process.env;

export const defaultEmail = 'email@test.com';
export const defaultPassword = 'password';
export const randomHashedPassword = randomBytes(24).toString('hex');

export const defaultUser: User = {
  id: 1,
  email: defaultEmail,
  password: defaultPassword,
  isAdmin: false,
  reports: [],
};

export const defaultReport = {
  make: 'toyota',
  model: 'corolla',
  year: 1980,
  lat: 1,
  lng: 2,
  mileage: 10000,
  price: 1000,
};

export const getRandomReportData = () => {
  const makers = ['toyota', 'ford', 'honda', 'audi'];
  const models = ['corolla', 'focus', 'civic', 'a6'];
  const minYear = 1990;
  const maxYear = new Date().getFullYear();
  const maxMileage = 1000000;
  const maxPrice = 1000000;

  const getRandomNumber = (maxNumber: number): number =>
    Math.floor((Math.random() || 0.1) * maxNumber);

  return {
    make: makers[getRandomNumber(3)],
    model: models[getRandomNumber(3)],
    year: getRandomNumber(maxYear - minYear) + minYear,
    lat: getRandomNumber(90),
    lng: getRandomNumber(180),
    mileage: getRandomNumber(maxMileage),
    price: getRandomNumber(maxPrice),
  };
};
