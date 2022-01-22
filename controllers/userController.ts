import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

// Add extra variables to express session
declare module 'express-session' {
  interface Session {
    browser: String;
    userID: String;
  }
}

// This function is invoked to register a new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    // Get user credentials
    const { name, surname, username, password } = req.body;

    // Validate user credentials
    if (!(username && password && name && surname)) {
      res.status(400).send('All input is required');
    }

    // Check if user already exists
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).render('signup', { str: 'User already exists!' });
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      surname,
      username: username,
      password: encryptedPassword,
    });

    // redirect new user to login page
    return res.status(201).render('login', {
      str: 'You have been succesfully registered. Please login.',
    });
  } catch (err) {
    console.log(err);
  }
};

// this function is invoked when user tries to login
export const checkUser: RequestHandler = async (req, res) => {
  try {
    // Get user input at login page
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exists in the database
    const user = await User.findOne({ username });

    // If user exists and password matches, create token
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, browser: req.headers['user-agent'] },
        process.env.TOKEN_KEY,
        {
          expiresIn: '5m',
        }
      );

      // save user token
      user.token = token;

      // user session
      req.session.userID = user._id;
      req.session.browser = req.headers['user-agent'];

      // set cookie
      res.cookie('access_token', token, {
        httpOnly: true,
      });

      // Route authenticated user to welcome page
      return res.status(200).render('welcome', { user });
    } else {
      res.status(400).render('login', { str: 'Invalid credentials!' });
    }
  } catch (err) {
    console.log(err);
  }
};

// this function is invoked to list all users in the database
export const listUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.render('userlist', { users });
};

// this function is invoked when user clicks on logout button.
export const logoutUser: RequestHandler = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
};
