import { RequestHandler } from 'express';
import jwtDecode from 'jwt-decode';
const config = process.env;

// define an interface for decoded token
interface MyToken {
  id: string;
  browser: string;
}

// add new parameters to session
declare module 'express-session' {
  interface Session {
    browser: String;
    userID: String;
  }
}

// this middleware function is invoked to authenticate the user
const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  // check if there is a token in the cookie
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
      res.locals.id = decoded.id;
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
