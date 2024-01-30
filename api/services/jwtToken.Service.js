const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config();

module.exports.createJwt = async (user) => {
    try {
        const token = jwt.sign({ data: user }, process.env.JWT_SECRET, { expiresIn: '5h' });
        return token;
    } catch (error) {
        console.log("Error", error);
        throw error; 
    }
};
