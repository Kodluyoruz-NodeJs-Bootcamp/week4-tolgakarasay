import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
const config = process.env;
import jwtDecode from 'jwt-decode';

interface MyToken {
  id: string;
  browser: string;
  // whatever else is in the JWT.
}

declare module 'express-session' {
  interface Session {
    browser: String;
    userID: String;
  }
}

const verifyToken: RequestHandler = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(403)
      .render('login', { str: 'Token not found! Login to gain access.' });
  }
  try {
    const decoded = jwtDecode<MyToken>(token);

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
