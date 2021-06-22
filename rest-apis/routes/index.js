import express from 'express';
const router = express.Router();
import {registerController,loginController,userController,refreshController,productController} from "../controllers/index.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js"
//register user
router.post('/api/register',registerController.register);
router.post('/api/login',loginController.login);
router.get('/api/me',auth,userController.me);
router.post('/api/refresh',refreshController.refresh);

router.post('/api/logout',auth,loginController.logout);
router.post('/api/products/',[auth,admin],productController.store);
router.put('/api/products/:id',[auth,admin],productController.update);
router.delete('/api/products/:id',[auth,admin],productController.destroy);
router.get('/api/products',productController.index);
router.get('/api/products/:id',productController.show);
export default router;