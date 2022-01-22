import { RequestHandler } from 'express';

// render index page
export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index');
};

// redirect to index page
export const redirectToIndexPage: RequestHandler = (req, res) => {
  res.status(200).redirect('/');
};

// render login page
export const getLoginPage: RequestHandler = (req, res) => {
  res.render('login', { str: '' });
};

// render signup page
export const getSignupPage: RequestHandler = (req, res) => {
  res.render('signup');
};
