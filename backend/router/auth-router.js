var express = require('express');
var router = express.Router();

var userController = require('../controllers/auth-controller');

router.get('/getAllUser',userController.getAllUsers)// localhost:3000/auth/

router.post('/getuser',userController.getUser)
router.post('/signup',userController.postUser); // localhost:3000/auth/signup
// router.put('/updatest',userController.updateStudent);// localhost:3000/user/updatest
// router.put('/updatest/:age',userController.updatenewStudent);// localhost:3000/user/updatest
router.delete('/delete/:username',userController.deleteUser);//localhost:3000/user/:id

router.post('/forgot-password', userController.forgotPassword); // לשליחת קוד איפוס למייל
router.post('/reset-password', userController.resetPassword);   // לאימות קוד ואיפוס סיסמה
//localhost:3000/auth/send-reset-code

module.exports = router;

