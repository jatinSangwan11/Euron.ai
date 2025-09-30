import express from 'express'
import { auth } from '../middlewares/auth.ts';
import { getPublishedCreations, getUserCreations, toogleLikeCreation } from '../controllers/userController.ts';

const userRouter = express.Router();


userRouter.get('/get-user-creations', auth, getUserCreations)
userRouter.get('/get-published-creations', auth, getPublishedCreations)
userRouter.post('/toogle-like-creation', auth, toogleLikeCreation)


export default userRouter;