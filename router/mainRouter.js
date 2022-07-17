const Router = require('express').Router
const userController = require('../controllers/userController')
const authMiddleware = require('../mw/auth-mw')

const router = new Router()



router.post('/signup', userController.signup)
router.post('/signin', userController.signin)
router.post('/logout', userController.logout) 
router.get('/refresh', userController.refresh) 
router.get('/users', authMiddleware, userController.getUsers) //этот путь доступен только для авторизованных пользователей




module.exports = router