const {Router} = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {signUpUser, loginUser, getUser, changePFP, editUser, getAllUsers} = require('../controllers/userController');

const router = Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.get('/', getAllUsers);
router.post('/change-pfp', authMiddleware, changePFP);
router.patch('/edit-user', authMiddleware, editUser);

module.exports = router;