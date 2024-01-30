const { Server } = require("socket.io");
const Notification = require("../models/notification");
let io;



const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        socket.emit("message", "Welcome to the user");

        // Send existing notifications to the connected user
        Notification.find().exec((err, notifications) => {
            if (err) {
                console.error("Error fetching notifications:", err);
                return;
            }

            socket.emit("notifications", notifications);
        });

        socket.on("disconnect", () => {
            console.log("User disconnect", socket.id);
        });
    });
};

const emitMessage = async (data) => {
    const { userId, adminId, message,editorId ,superAdminId,postId,commentId,approvalMessage} = data;

  
    const notification = new Notification({ userId, adminId, message,editorId,superAdminId,postId,commentId,approvalMessage });

    try {
        await notification.save();

        const superAdminId = '65955ab83f6f1a517910e524'; 
        if (superAdminId) io.to(superAdminId).emit('notification', data); 
        if (editorId) io.to(editorId).emit("notification", data);
        if (postId) io.to(postId).emit("notification", data); 
        if (commentId) io.to(commentId).emit("notification", data); 
        if (userId) io.to(userId).emit("notification", data);  
        if (adminId) io.to(adminId).emit("notification", data); 
    } catch (error) {
        console.error("Error saving notification:", error);
    }
};

module.exports = {
    initSocket,
    emitMessage,
};
