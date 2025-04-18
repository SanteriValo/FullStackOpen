const bcrypt = require('bcryptjs')
const User = require('../models/user')

const createUser = async (req, res) => {
    try {
        const { username, name, password } = req.body;

        if (!username || username.length < 3) {
            return res.status(400).json({ error: 'username must be at least 3 characters long' });
        }
        if (!password || password.length < 3) {
            return res.status(400).json({ error: 'password must be at least 3 characters long' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            name,
            passwordHash
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ error: 'username must be unique' });
        }
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    getAllUsers,
}