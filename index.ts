// MODULES
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as ejs from 'ejs';
import { createConnection, getConnection } from 'typeorm';
import { TypeormStore } from 'typeorm-store';
require('dotenv').config();
import { Session } from './entity/Session';
import userRoute from './routes/userRoute';
import pageRoute from './routes/pageRoute';

const app = express();

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// ROUTES
app.use('/', pageRoute);
app.use('/', userRoute);

(async () => {
  // DB CONNECTION
  await createConnection();

  // SESSION
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        repository: getConnection().getRepository(Session),
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        sameSite: true,
        httpOnly: true,
      },
    })
  );

  // START THE SERVER
  const { API_PORT } = process.env;
  app.listen(API_PORT, () => {
    console.log(`Server started at port ${API_PORT}`);
  });
})();
