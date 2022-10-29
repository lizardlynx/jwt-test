'use strict';
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function for creating access token (standard)
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '25s' })
}

//get token cookies
function getTokenCookies(cookies) {
    let error = 0;
    let token = null;
    let refreshToken = null;
    cookies = cookies && cookies.split('; ');
    if (!cookies) error = 1;
    else {
        // get tokens
        for (let cookie of cookies) {
            if (cookie.includes('authcookie=')) token = cookie.split('authcookie=')[1];
            else if (cookie.includes('refreshcookie=')) refreshToken = cookie.split('refreshcookie=')[1];
        }
    }
    return { error, token, refreshToken }
}

module.exports = { generateAccessToken, getTokenCookies };
