const mongoose = require("mongoose");

// Define a Notification schema
const notificationSchema = new mongoose.Schema({
    message: String,
    approvalMessage:String,
    userId: String,
    adminId: String,
    superAdminId: String,
    editorId: String,
    commentId:String,
    postId:String,
    timestamp: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
