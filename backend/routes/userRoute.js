import express from 'express';
import { registerUser,  loginUser , updateUser , deleteUser, forgetPassword, resetPassword, updatePassword, searchFriend, getFriend, followUnfollowUser } from '../controllers/userController.js';
import checkToken from '../middleware/checkToken.js';
const router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)
router.put('/update',checkToken, updateUser)
router.delete('/delete',checkToken, deleteUser)
router.post('/forget',forgetPassword)
router.get('/resetPassword/:resetToken', resetPassword)
router.put('/updatePassword/:resetToken',updatePassword)
router.get('/searchFriends',checkToken,searchFriend)
router.get('/friend/:friendId',checkToken,getFriend)
router.put('/followUnfollow/:friendId', checkToken, followUnfollowUser)


export default router