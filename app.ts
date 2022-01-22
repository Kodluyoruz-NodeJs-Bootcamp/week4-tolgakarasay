// MODULES
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import ejs from 'ejs';
const MongoDBStore = require('connect-mongodb-session')(session);
const pageRoute = require('./routes/pageRoute').default;
import userRoute from './routes/userRoute';

const app = express();
require('dotenv').config();
require('./config/database').connect();

// SESSION STORE
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions',
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
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
