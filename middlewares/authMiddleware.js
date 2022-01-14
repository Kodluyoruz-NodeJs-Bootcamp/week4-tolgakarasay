const jwt = require('jsonwebtoken');

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(403)
      .render('login', { str: 'Token not found! Login to gain access.' });
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
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

module.exports = verifyToken;
