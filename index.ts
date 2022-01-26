// MODULES
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as ejs from 'ejs';
const pageRoute = require('./routes/pageRoute').default;
import userRoute from './routes/userRoute';
import { TypeormStore } from 'typeorm-store';
import { createConnection, getConnection } from 'typeorm';
import { Session } from './entity/Session';
import { connect } from './config/database';

createConnection()
  .then(() => {
    const app = express();
    require('dotenv').config();
    // MIDDLEWARES
    app.use(express.static('public'));

    // TEMPLATE ENGINE
    app.set('view engine', 'ejs');
    app.use(express.json({ limit: '50mb' }));

    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
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

    // ROUTES
    app.use('/', pageRoute);
    app.use('/', userRoute);

    // START THE SERVER
    const { API_PORT } = process.env;
    app.listen(API_PORT, () => {
      console.log(`Server started at port ${API_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
