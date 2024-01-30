const { emitMessage } = require('../services/socket');
const Notification = require('../models/notification');
const User = require('../models/user'); 
const response = require('../services/respones');



const handleNotification = async (req, res) => {
    const { message, userId } = req.body;

    try {
        const admin = await User.findOne({ role: 'admin' });
        const superAdmin = await User.findOne({ role: 'superAdmin' });
        const editor = await User.findOne({ role: 'editor' || 'Editor'});

        

        if (!admin || !superAdmin ||!editor) {
            throw new Error("Admin or SuperAdmin and owner not found");
        }

        const notification = new Notification({
            message: message,
            commentId:commentId,
            // userId: userId,
            editorId:editor._id,
            adminId: admin._id,
            superAdminId: superAdmin._id,
            
        });

     
        emitMessage({
            message: notification.message,
            commentId :notification.commentId,
            // userId: notification.userId,
            adminId: notification.adminId,
            editorId:notification.editorId,
            superAdminId: notification.superAdminId
            
        });
    
        await notification.save();

        response.success = true;
        response.message = "Send Notification successfully";
        response.data = notification;

        res.status(200).json(response);
    } catch (error) {
        console.error("Error saving notification:", error);
        res.status(500).json({
            success: false,
            message: "Error saving notification",
            error: error.message,
        });
    }
};



const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        
        response.success = true;
        response.message = "Get all notifications successfully";
        response.data = notifications;

        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving notifications",
            error: error.message,
        });
    }
};

const getBlogAndCommantNotification = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [{ approvalMessage: { $exists: true } }, { commentId: { $exists: true } },{userId:{$exists: true }}],
        });

        if (!notifications) {
            return res.status(404).json({
                success: false,
                message: "Not found notifications",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get C&P Notifications Successfully",
            data: notifications,
        });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving notifications",
            error: error.message,
        });
    }
};

const getAlltNotificationByAdmin = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [{ approvalMessage: { $exists: true } }, { commentId: { $exists: true } },{postId:{$exists: true }}],
        });

        if (!notifications) {
            return res.status(404).json({
                success: false,
                message: "Not found notifications",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get C&P Notifications Successfully",
            data: notifications,
        });
    } catch (error) {
        console.error("Error retrieving notifications:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving notifications",
            error: error.message,
        });
    }
};


module.exports = {
    handleNotification,
    getAllNotifications,
    getBlogAndCommantNotification,
    getAlltNotificationByAdmin
};

// const handleNotification = async (req, res) => {
//     const { message, userId, adminId } = req.body;

//     try {
//         // Create a single Notification instance for both user and admin
//         const notification = new Notification({
//             message: message,
//             userId: userId,
//             adminId: adminId,
//         });

//         // Emit the notification to both user and admin
//         emitMessage({
//             message: notification.message,
//             userId: notification.userId,
//         });

//         if (adminId) {
//             const admin = await User.findById(adminId);
//             if (admin) {
//                 emitMessage({
//                     message: notification.message,
//                     userId: admin.userId,
//                     adminId: adminId,
//                 });
//             } else {
//                 console.error("Admin not found with the specified _id:", adminId);
//             }
//         }

//         // Save the single notification
//         await notification.save();

//         response.success = true;
//         respones.message = "Send Notification successfully";
//         respones.data = notification;

//         res.status(200).json(respones);
//     } catch (error) {
//         console.error("Error saving notification:", error);
//         res.status(500).json({
//             success: false,
//             message: "Error saving notification",
//             error: error.message,
//         });
//     }
// };

// module.exports = {
//     handleNotification,
// };