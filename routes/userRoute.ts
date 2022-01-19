const router = require('express').Router();
import * as userController from '../controllers/userController';
const auth = require('../middlewares/authMiddleware').default;

router.route('/register').post(userController.registerUser);
router.route('/welcome').post(userController.checkUser);
router.route('/list').get(auth, userController.listUsers);
router.route('/logout').get(userController.logoutUser);

export default router;
