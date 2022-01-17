const router = require('express').Router();
const pageController = require('../controllers/pageController');
const auth = require('../middlewares/authMiddleware');

router.route('/login').get(pageController.getLoginPage);
router.route('/signup').get(pageController.getSignupPage);
router.route('/').get(auth, pageController.getIndexPage);
router.route('/welcome').get(pageController.redirectToIndexPage);

module.exports = router;
