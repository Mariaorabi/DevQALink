var express = require('express');
var router = express.Router();

var userController = require('../controllers/auth-controller');

router.get('/',userController.getAllUsers)// localhost:3000/user/
router.post('/getuser',userController.getUser) // localhost:3000/auth/getuser
router.post('/signup',userController.postUser); // localhost:3000/user/signup
// router.put('/updatest',userController.updateStudent);// localhost:3000/user/updatest
// router.put('/updatest/:age',userController.updatenewStudent);// localhost:3000/user/updatest
router.delete('/delete/:username',userController.deleteUser);//localhost:3000/user/:id


module.exports = router;