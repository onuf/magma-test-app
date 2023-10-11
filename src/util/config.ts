import dotenv from 'dotenv';

dotenv.config();

interface Config {
  PORT: string | number,
  DATABASE_URL: string,
}

const config: Config = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/users_db',
};

export default config;
