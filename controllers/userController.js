const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    // Get user input
    const { name, surname, username, password } = req.body;

    // Validate user input
    if (!(username && password && name && surname)) {
      res.status(400).send('All input is required');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      surname,
      username: username.toLowerCase(), // sanitize: convert username to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    );

    // redirect new user to login page
    const str = `You have been succesfully registered. Please login.`;
    res.status(201).render('login', { str });
  } catch (err) {
    console.log(err);
  }
};

exports.checkUser = async (req, res) => {
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

      // save session to DB

      // set cookie
      res.cookie('access_token', token, {
        httpOnly: true,
      });

      return res.status(200).render('welcome', { user });
    } else {
      res.status(400).send('Invalid Credentials');
    }
  } catch (err) {
    console.log(err);
  }
};

exports.listUsers = async (req, res) => {
  const users = await User.find();

  res.render('userlist', { users });
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
