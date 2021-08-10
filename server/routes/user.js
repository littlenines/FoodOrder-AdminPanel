const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const menuController = require('../controllers/menuController');
const isAuth = require("../middleware/isAuth");

// Main page for ordering
router.get('/',menuController.main);
router.post('/',menuController.find);
router.get('/order/:id',menuController.edit);
router.post('/order/:id',menuController.order);
// Admin part
router.get('/users',isAuth,userController.users);
router.post('/users',userController.register);
router.get('/admin',userController.admin);
router.get('/register',userController.adminRegisterView);
router.post('/register',userController.adminRegister);
router.get('/addproduct',isAuth, userController.viewproduct);
router.post('/addproduct',isAuth, userController.addproduct);

router.get('/editproduct/:id',isAuth, userController.viewedit);
router.post('/editproduct/:id',isAuth, userController.update);
router.post('/admin',userController.login);
router.post('/logout',userController.logout);
router.get('/hero',isAuth,userController.hero);
router.get('/vieworder/:id',isAuth,userController.vieworder);
router.get('/product',isAuth, userController.warehouse);
router.get('/product/:id',userController.deleteProduct);
router.get('/:id',userController.delete);


module.exports = router;