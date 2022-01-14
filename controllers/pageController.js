exports.getIndexPage = (req, res) => {
  res.status(200).render('index');
};

exports.redirectToIndexPage = (req, res) => {
  res.status(200).redirect('/');
};

exports.getLoginPage = (req, res) => {
  res.render('login', { str: '' });
};

exports.getSignupPage = (req, res) => {
  res.render('signup');
};
