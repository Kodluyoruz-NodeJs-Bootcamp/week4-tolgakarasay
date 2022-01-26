// DB CONNECTION
import { createConnection } from 'typeorm';

export const connect = () => {
  createConnection()
    .then(() => {
      console.log('Database connection successful');
    })
    .catch((error) => {
      console.log('Database connection failed !');
      console.error(error);
      process.exit(1);
    });
};
