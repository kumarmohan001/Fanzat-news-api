const userModel = require('../models/user')
const bcryptService = require('../services/bcrypt.service')
const camparePassword = require('../services/camparePassword')
const response = require('../services/respones')
const jwtServices = require('../services/jwtToken.Service')

module.exports.login = async (req, res) => {

    try {
        const { user_email, user_pass } = req.body;
        const Editor = await userModel.findOne({  user_email  });

        if (!Editor) {
            response.success = false;
            response.message = 'Editor not found';
            response.data = null,
                res.status(404).json(response);
        }

        const comparePassword = await camparePassword.comparePasswords(user_pass, Editor.user_pass);

        if (comparePassword) {
            const EditorToken = await jwtServices.createJwt(Editor);
            response.success = true;
            response.message = 'Editor Login Successfully';
            response.data = { Editor, accessToken: EditorToken };
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

module.exports.getByIdEditor = async (req, res) => {
    try {
        const { ID } = req.params
        const editorData = await userModel.findById(ID)
        if (!editorData) {
            response.success = false,
                response.message = "Editor Not Found",
                response.data = null,
                res.status(404).json(response)
        }
        response.success = true,
            response.message = 'Get Editor Successfully',
            response.data = editorData,
            res.status(200).json(response)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error';
        response.data = null;
        res.status(500).json(response)
    }
}

module.exports.updateEditor = async (req, res) => {
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
}


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

module.exports.ChangePassword = async (req, res) => {
    try {
        const { _id } = req.params;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        const userData = await userModel.findOne({ _id: _id })
        if (!userData) {
            response.success = false,
            response.message = "Admin Not Found"
            res.status(401).json(response)
        } else {
            const matchPassword =await  camparePassword.comparePasswords(oldPassword, userData.user_pass)
            if (matchPassword) {
                if (newPassword === confirmPassword) {
                    const hashsPassword = await bcryptService.hashPassword(newPassword);
                    const updatePassword = await userModel.findByIdAndUpdate(_id, { user_pass: hashsPassword })
                    if (updatePassword) {
                        response.success = true,
                        response.message = 'Password update Successfully'
                        response.data = updatePassword,
                        res.status(200).json(response)

                    } else {
                        response.success = false,
                        response.message = "Not Update Password"
                        res.status(400).json(response)
                    }
                } else {
                    response.success = false,
                    response.message = "Please Write correct Confirm Password"
                    res.status(400).json(response)
                }

            } else {
                response.success = false,
                response.message = "OldPassword password not correct"
                res.status(400).json(response)
            }
        } 
    } catch (error) {
        console.log(error);
        response.success = false,
        response.message = "Internal Server Error"   
        res.status(500).json(response)
    }
}


