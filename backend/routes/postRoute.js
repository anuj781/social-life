import express from 'express';
import { allPosts, commentDelete, commentPost, createPost, deletePost, likePost, yourPosts } from '../controllers/postController.js';
import checkToken from '../middleware/checkToken.js';
const router = express.Router();


router.post('/cPost', checkToken,  createPost)
router.delete('/dPost/:postId',  deletePost)
router.get('/yourPost',checkToken,yourPosts)
router.get('/allPost',allPosts)
router.put('/likes/:postId',checkToken,likePost)
router.put('/comment/:postId',checkToken,commentPost)
router.delete('/deleteComment/:postId/:commentId',checkToken,commentDelete)
export default router