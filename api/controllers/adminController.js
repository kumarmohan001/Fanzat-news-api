const userModel = require('../models/user')
const bcryptService = require('../services/bcrypt.service')
const camparePassword = require('../services/camparePassword')
const response = require('../services/respones')
const jwtServices = require('../services/jwtToken.Service')


module.exports.login = async (req, res) => {

    try {
        const { user_email, user_pass } = req.body;
        const admin = await userModel.findOne({  user_email  });

        if (!admin) {
            response.success = false;
            response.message = 'admin not found';
            response.data = null,
            res.status(404).json(response);
        }

        const comparePassword = await camparePassword.comparePasswords(user_pass, admin.user_pass);

        if (comparePassword) {
            const adminToken = await jwtServices.createJwt(admin);
            response.success = true;
            response.message = 'admin Login Successfully';
            response.data = { admin, accessToken: adminToken };
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

module.exports.getByIdAdmin = async (req, res) => {
    try {
        const { ID } = req.params
        const adminData = await userModel.findById(ID)
        if (!adminData) {
            response.success = false,
            response.message = "admin Not Found",
            response.data = null,
            res.status(404).json(response)
        }
        response.success = true,
            response.message = 'Get admin Successfully',
            response.data = adminData,
            res.status(200).json(response)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error';
        response.data = null;
        res.status(500).json(response)
    }
}

module.exports.updateAdmin = async (req, res) => {
    try {
        const { user_nicename, user_email, user_url, user_login } = req.body;
        const { ID } = req.params;
    
       
        const adminData = await userModel.findByIdAndUpdate(ID,{
            user_nicename:user_nicename,
            user_email:user_email,
            user_url:user_url ,
            user_login:user_login

        },{ new: true });
        if (!adminData) {
          response.success = false;
          response.message = 'Admin Not Found';
          response.data = null;
          return res.status(404).json(response);
        }
        
        response.success = true;
        response.message = 'Admin Updated Successfully';
        response.data = adminData;
        res.status(200).json(response);
      } catch (error) {
       
        console.error(error);
        response.success = false;
        response.message = 'Internal Server Error';
        response.data = null;
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

module.exports.adminChangePassword = async (req, res) => {
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


