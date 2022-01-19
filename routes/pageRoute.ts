const router = require('express').Router();
import {
  getLoginPage,
  getSignupPage,
  getIndexPage,
  redirectToIndexPage,
} from '../controllers/pageController';
import auth from '../middlewares/authMiddleware';

router.route('/login').get(getLoginPage);
router.route('/signup').get(getSignupPage);
router.route('/').get(auth, getIndexPage);
router.route('/welcome').get(redirectToIndexPage);

export default router;
