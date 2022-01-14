// MODULES
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ejs = require('ejs');
const MongoDBStore = require('connect-mongodb-session')(session);
const userController = require('./controllers/userController');
const pageController = require('./controllers/pageController');
const auth = require('./middlewares/authMiddleware');

const app = express();
require('dotenv').config();

// DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.log('Database connection failed !');
    console.error(error);
    process.exit(1);
  });

// SESSION STORE
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'mySessions',
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
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
app.get('/login', pageController.getLoginPage);
app.get('/signup', pageController.getSignupPage);
app.get('/', auth, pageController.getIndexPage);
app.get('/welcome', pageController.redirectToIndexPage);

app.post('/register', userController.registerUser);
app.post('/welcome', userController.checkUser);
app.get('/list', auth, userController.listUsers);
app.get('/logout', userController.logoutUser);

// START THE SERVER
const { API_PORT } = process.env;
app.listen(API_PORT, () => {
  console.log(`Server started at port ${API_PORT}`);
});
