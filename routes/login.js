const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    users = require('./users')(usersdb);

const host = '127.0.0.1';
const port = 3000;

const tokenKey = '1a2b-3c4d-5e6f-7g8h';

var router = express.Router();

router.use(bodyParser.json());

router.use((req, res, next) => {
    if(req.headers.authorization){
        jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, (err, payload) => {
            if(err)
                next();
            else if(payload){
                for(let user of users){
                    if(user.id === payload.id){
                        req.user = user;
                        next();
                    }
                }

                if(!req.user) next();
            }
        });
    }

    next();
});

router.post('/auth', (req, res) => {
    for(let user of users){
        if(req.body.login === user.login && req.body.password === user.password){
            return res.status(200).json({
                id: user.id,
                login: user.login,
                token: jwt.sign({id: user.id}, tokenKey)
            });
        }
    }

    return res.status(404).json({message: 'User not found'});
});

router.get('/user', (req, res) => {
    if(req.user)
        return res.status(200).json(req.user);
    else
        return res.status(401).json({message: 'Not authorized'});
});
