const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.route('/register').post(userController.registerUser);
router.route('/welcome').post(userController.checkUser);
router.route('/list').get(auth, userController.listUsers);
router.route('/logout').get(userController.logoutUser);

module.exports = router;
