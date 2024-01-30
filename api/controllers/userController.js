const userModel = require('../models/user');
const bcrypt = require('../services/bcrypt.service')
const camparePassword = require('../services/camparePassword')
const response = require('../services/respones');
const jwtServices = require('../services/jwtToken.Service');
const { emitMessage } = require('../services/socket');


module.exports.userRegister = async (req, res) => {
    try {
        const { user_nicename, user_email, user_pass, user_url, user_login, role } = req.body;
        const responseObj = {};

        if (!user_nicename || !user_email || !user_pass || !user_url || !user_login) {
            responseObj.success = false;
            responseObj.message = 'Please fill in all required fields';
            responseObj.data = null;
            return res.status(400).json(responseObj);
        }
        if (role === "superadmin" ) {
            const existingUser = await userModel.findOne({ role });
            if (existingUser) {
                responseObj.success = false;
                responseObj.message = `Bad request. Only one user with role ${role} is allowed.`;
                responseObj.data = null;
                return res.status(400).json(responseObj);
            }
        }
        const images = req.files;

        const imagePaths = Array.isArray(images)
            ? images.map((image) => ({
                path: image.path,
                url: `https://newsapi.shqlbaz.com:8443/uploads/${encodeURIComponent(image.filename)}`,
            }))
            : [];
        const hashedPassword = await bcrypt.hashPassword(user_pass);
        const newUser = new userModel({
            user_login,
            user_nicename,
            user_email,
            user_pass: hashedPassword,
            user_url,
            user_registered: new Date(),
            images: imagePaths,
            role,
        });
        const notificationData = {
            userId: newUser._id,
            message: `Add New User ${user_nicename} .`,
        };

        emitMessage(notificationData);
        await newUser.save();

        responseObj.success = true;
        responseObj.message = 'User registered successfully';
        responseObj.data = newUser;
        res.status(200).json(responseObj);

    } catch (error) {
        console.error('Error in user registration:', error);
        const responseObj = {
            success: false,
            message: 'Internal Server Error. Unable to register user.',
            data: null,
        };
        res.status(500).json(responseObj);
    }
};


module.exports.login = async (req, res) => {

    try {
        const { user_email, user_pass } = req.body;
        const user = await userModel.findOne({ user_email });
        if (!user) {
            response.success = false;
            response.message = 'user not found';
            response.data = null,
                res.status(404).json(response);
        }
        const comparePassword = await camparePassword.comparePasswords(user_pass, user.user_pass);
        if (comparePassword) {
            const userToken = await jwtServices.createJwt(user);
            response.success = true;
            response.message = 'user Login Successfully';
            response.data = { user, accessToken: userToken };
            return res.status(201).json(response);
        } else {
            response.success = false;
            response.message = 'Invalid password';
            response.data = null,
                res.status(401).json(response);
        }
    } catch (error) {
        console.error(error);
        response.message = 'Internal Server Error';
        return res.status(500).json(response);
    }
};

module.exports.getAllData = async (req, res) => {
    try {
        const data = await userModel.find()

        response.success = true,
            response.message = 'Get All User Successfully ',
            response.data = data,
            res.status(200).json(response)

    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error';
        response.data = null;
        res.status(500).json(response)
    }
}

module.exports.getByIdUser = async (req, res) => {
    try {
        const { ID } = req.params
        const userData = await userModel.findById(ID)
        if (!userData) {
            response.success = false,
                response.message = "User Not Found",
                response.data = null,
                res.status(404).json(response)
        }
        response.success = true,
            response.message = 'Get User Successfully',
            response.data = userData,
            res.status(200).json(response)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error';
        response.data = null;
        res.status(500).json(response)
    }
}


module.exports.updateUser= async (req, res) => {
    try {
      const { ID} = req.params;
      const existingUser= await userModel.findById(ID);
  
      if (!existingUser) {
        response.message = 'User not found';
        return res.status(404).json(response);
      }
  
      if (req.body.user_nicename) existingUser.user_nicename = req.body.user_nicename;
      if (req.body.user_email)  existingUser.user_email = req.body.user_email;
      if (req.body.user_login)  existingUser.user_login = req.body.user_login;
  
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const images = req.files;
        const imagePaths = images.map((image) => ({
          path: image.path,
          url: `https://newsapi.shqlbaz.com:8443/uploads/${encodeURIComponent(image.filename)}`,
        }));
        existingUser.images = imagePaths;
      }
  
      const updatedUser= await existingUser.save();
  
      response.success = true;
      response.message = 'User updated successfully';
      response.data = updatedUser;
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      response.message = 'Internal Server Error';
      res.status(500).json(response);
    }
  };


module.exports.userDelete = async (req, res) => {
    try {
        const { ID } = req.params
        const userData = await userModel.findByIdAndDelete(ID)
        if (!userData) {
            response.success = false,
                response.message = "User Not Found",
                response.data = null,
                res.status(404).json(response)
        }


        response.success = true,
            response.message = "User Delete Successfully",
            response.data = null,
            res.status(200).json(response)

    } catch (error) {
        response.success = false,
            response.message = "Internal Server Error",
            response.data = null,
            res.status(500).json(response)

    }
}

