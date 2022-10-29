'use strict';
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const utilities = require('./utilities.js');
const generateAccessToken = utilities.generateAccessToken;
const getTokenCookies = utilities.getTokenCookies;

function authenticate(req, res, next) {
    //get token from cookies
    const cookies = req.headers['cookie'];
    const {error, token, refreshToken} = getTokenCookies(cookies);

    //if  error
    if (error) return res.status(401).send('<h1><a href="signin.html">Sign In</a></h1>');    

    //if no access token send unauthorized error
    if (token == null) return res.status(401).send('<h1><a href="signin.html">Sign In</a></h1>');
    
    //verify token and set user field 
    jwt.verify(token, process.env.ACCESS_SECRET, async (error, user) => {
        if (error && refreshToken) {

            // if access token timeout
            const file = await fs.readFile('refreshTokens.txt', 'utf8');
            const refreshTokens = file.split('; ');

            //check if refresh token exists
            if (!refreshTokens.includes(refreshToken)) return res.status(403).send('<h1><a href="signin.html">Sign In</a></h1>');
            
            //check if token is valid and set new access token if it is
            jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, user) => {
                if (error) return res.status(403).send('<h1><a href="signin.html">Sign In</a></h1>');
                const refreshUser = { login: user.login, password: user.password };
                const token = generateAccessToken(refreshUser);
                console.log('generate new access token');
                res.cookie('authcookie', token);
                req.user = refreshUser;
                return next();
            });
        } else if (error){

            //if no refresh token and error
            return res.status(403).send('<h1><a href="signin.html">Sign In</a></h1>');
        } else {
            req.user = user;
            next();
        } 
    });    
}

module.exports = { authenticate };
