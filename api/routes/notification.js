const app = require('express').Router();
const notifCtr = require('../controllers/notificationController')



// // validation.....
// const validation = require('../services/joiValidation')

// auth.....
const {checkUserAuth} = require("../middleware/auth")
const auth = require("../services/roleService")

app.post('/notification', notifCtr.handleNotification); 
app.get('/getAllNotificationByNotification', notifCtr.getAllNotifications);   
app.get('/getCommant&PostNotificationByEditor', notifCtr.getBlogAndCommantNotification);
app.get('/getAllNotificationDataByAdmin', notifCtr.getAlltNotificationByAdmin);

module.exports=app