const bcrypt = require('bcrypt');

module.exports.comparePasswords = async (password, hashedPassword) => {
    console.log(password,hashedPassword)
    try {
        if (!password || !hashedPassword) {
            throw new Error('Both password and hashedPassword are required for comparison.');
        }

        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error(error);
        throw  Error('Password comparison failed');
    }
};
