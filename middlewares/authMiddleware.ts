import { RequestHandler } from 'express';
import jwtDecode from 'jwt-decode';
const config = process.env;

// define an interface for decoded token
interface MyToken {
  id: string;
  browser: string;
}

// Add extra variables to SessionData
declare module 'express-session' {
  interface SessionData {
    browser: String;
    userID: String;
  }
}

// this middleware function is invoked to authenticate the user
const verifyToken: RequestHandler = (req, res, next) => {
  // check if there is a token in the cookie
  const token = req.cookies.access_token;
  if (!token) {
    return res
      .status(403)
      .render('login', { str: 'Token not found! Login to gain access.' });
  }

  try {
    // Decode the token
    const decoded = jwtDecode<MyToken>(token);

    // Check if cookie's id and browser info match with session's.
    if (
      decoded.id == req.session.userID &&
      decoded.browser == req.headers['user-agent']
    ) {
      return next();
    }
    return res
      .status(403)
      .render('login', { str: 'Access Denied! Login to gain access.' });
  } catch (err) {
    return res
      .status(401)
      .render('login', { str: 'Invalid Token! Login to gain access.' });
  }
};

export default verifyToken;
