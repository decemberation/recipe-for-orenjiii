const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization;

    if(Authorization && Authorization.startsWith('Bearer')) {
        const token = Authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return next(new HttpError('Not authorized, token failed', 403));
            }
            req.user = decoded;
            next();
        });
    }
    else {
        return next(new HttpError('Not authorized, no token', 403));
    }
};

module.exports = authMiddleware;