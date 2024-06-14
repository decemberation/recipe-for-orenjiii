const HttpError = require('../models/errorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');
const User = require('../models/userModel');

// Sign up a new user
// POST: /api/users/signup
// Unprotected route
const signUpUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError('All fields are required', 422));
        }
        
        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email: newEmail});
        if (emailExists) {
            return next(new HttpError('Email already exists', 422));
        }


        if(password.trim().length < 6) {
            return next(new HttpError('Password must be at least 6 characters long', 422));
        }

        if(password !== password2) {
            return next(new HttpError('Passwords do not match', 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({name, email: newEmail, password: hashedPassword});
        res.status(201).json('Successfully signed up with email: ' + newUser.email);

    } catch (error) {
        return next(new HttpError('Signing up failed, please try again', 422))
    }
};

// Log in a registered user
// POST: /api/users/login
// Unprotected route
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return next(new HttpError('All fields are required', 422));
        }
        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail});
        if (!user) {
            return next(new HttpError('Incorrect email or password. Please try again.', 422));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new HttpError('Incorrect email or password. Please try again.', 422));
        }

        const {_id: id, name } = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({id, name, token});

    } catch (error) {
        return next(new HttpError('Logging in failed, please try again', 422));
    }
};

// User profile
// GET: /api/users/:id
// Protected route
const getUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError('User not found', 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
};

// Change user pfp
// POST: /api/users/change-pfp
// Protected route
const changePFP = async (req, res, next) => {
    try {
        if(!req.files) {
            return next(new HttpError('No file uploaded', 422));
        }

        // Find user from DB
        const user = await User.findById(req.user.id);
        // Delete old pfp
        if(user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if(err) {
                    return next(new HttpError(err));
                }
            });
        }

        const {avatar} = req.files;
        // Check file size
        if(avatar.size > 2000000) {
            return next(new HttpError('File size too large. Must be less than 2MB', 422));
        }

        let fileExtension = avatar.name.split('.')[1];
        let newFileName = uuid() + '.' + fileExtension;
        avatar.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
            if(err) {
                return next(new HttpError(err));
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFileName}, {new: true});
            if(!updatedAvatar) {
                return next(new HttpError('Could not update profile picture', 422));
            }
            res.status(200).json(updatedAvatar);
        });
    } catch (error) {
        return next(new HttpError(error))
    }
};

// Edit user profile
// POST: /api/users/edit-user
// Protected route
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if (!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
            return next(new HttpError('All fields are required', 422));
        }

        // Get user from DB
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        // Check if new email isn't already in use
        const emailExists = await User.findOne({email});
        if(emailExists && emailExists._id !== req.user.id) {
            return next(new HttpError('Email already exists', 422));
        }

        // Compare current password with password in DB
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError('Incorrect password', 422));
        }

        // Compare new password with confirm password
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError('Passwords do not match', 422));
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user info in DB
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {name, email, password: hashedPassword}, {new: true});
        res.status(200).json(updatedUser);
    } catch (error) {
        return next(new HttpError(error))
    }
};

// Get all users
// GET: /api/users/all-users
// Unprotected route
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        return next(new HttpError(error))
    }
};

module.exports = {signUpUser, loginUser, getUser, changePFP, editUser, getAllUsers};