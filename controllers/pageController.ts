import { RequestHandler } from 'express';

export const getIndexPage: RequestHandler = (req, res) => {
  res.status(200).render('index');
};

export const redirectToIndexPage: RequestHandler = (req, res) => {
  res.status(200).redirect('/');
};

export const getLoginPage: RequestHandler = (req, res) => {
  res.render('login', { str: '' });
};

export const getSignupPage: RequestHandler = (req, res) => {
  res.render('signup');
};
