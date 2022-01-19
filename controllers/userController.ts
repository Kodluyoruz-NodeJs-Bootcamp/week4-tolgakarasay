import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

declare module 'express-session' {
  interface Session {
    browser: String;
    userID: String;
  }
}

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
      return res.status(409).send('User Already Exist. Please Login');
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
    const str = `You have been succesfully registered. Please login.`;
    return res.status(201).render('login', { str });
  } catch (err) {
    console.log(err);
  }
};

export const checkUser: RequestHandler = async (req, res) => {
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
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
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    console.log(err);
  }
};

export const listUsers: RequestHandler = async (req, res) => {
  const users = await User.find();
  res.render('userlist', { users });
};

export const logoutUser: RequestHandler = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/login');
    }
  });
};
