'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const middleware = require('./middleware.js');
const authenticate = middleware.authenticate;
const jwt = require('jsonwebtoken');
const utilities = require('./utilities.js');
const { log } = require('console');
const generateAccessToken = utilities.generateAccessToken;
const getTokenCookies = utilities.getTokenCookies;
const fs = require('fs').promises;

//logged users
const users = {
    'may': { login: 'may', password: 'password1', name: "May", picture: "https://i.pinimg.com/564x/a6/16/52/a61652206089d48092f9b38f49b302a9.jpg" },
    'february': { login: 'february', password: 'password2', name: "February", picture: "https://i.pinimg.com/564x/de/d0/34/ded0349c0c2f427b31973e78da0ccd70.jpg"}
};

//logout all paths
app.use(function(req, res, next) {
    console.log(req.path);
    next();
});

//sending JSON data through POST requests
app.use(express.json());

//serving files from public folder
app.use(express.static('public'));

app.post('/signin', async (req, res) => {
    // authenticate user
    const login = req.body.login;
    const password = req.body.password;
    let logged = 0;
    for (let login in users) {
        const user = users[login];
        if (user.login == login && user.password == password) logged = 1;
    }
    if (!logged) return res.sendStatus(401);

    //generate tokens and set cookies
    const user = { login, password };
    const token = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET)

    await fs.appendFile('refreshTokens.txt', refreshToken + '; ');

    res.cookie('authcookie', token);
    res.cookie('refreshcookie', refreshToken);
    res.sendStatus(200);
});

// routes that need authentication
app.use(authenticate);
app.use(express.static('registered'));

app.get('/loggedin', (req, res) => res.sendStatus(200));
app.get('/logout', async (req, res) => {
    //get token from cookies
    const cookies = req.headers['cookie'];
    const {error, token, refreshToken} = getTokenCookies(cookies);
    // if (error) cannot happen because authentication process already succeeded

    //delete
    res.clearCookie('authcookie');
    res.clearCookie('refreshcookie');
    const file = await fs.readFile('refreshTokens.txt', 'utf8');
    const refreshTokens = file.split('; ').filter(token => token != refreshToken);
    await fs.writeFile('refreshTokens.txt', refreshTokens.join('; '));
    res.sendStatus(204);
    
});
app.get('/picture', (req, res) => {
    const login = req.user.login;
    const user = users[login];
    const name = user.name;
    const image = user.picture;
    res.json({ image, name });
});

app.listen(3000);

