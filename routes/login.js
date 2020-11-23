const express = require('express');
const router = express.Router();
const db = require('../database');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');


const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;


let auth = passport.authenticate('jwt', {
    session: false
});
const params = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};


passport.use('jwt',new Strategy(params, (payload, done) => {
    console.log(payload.idUser);
    db.userDatabase.findByPk(payload.id)
        .then(user => {
            console.log(payload.idUser);
            console.log(user.idUser + "   *****");
            if(user){
                return done(null, {
                    id: user.id,
                    username: user.username,
                });
            }
            return done(null, false);
        }).catch(err => console.error(err));

}));



router.get('/', (req, res)=> {
    res.render('login.hbs', { title: 'Pet Care API' });
});

router.post('/', (req, res) => {
    const errors = {};
    const username = req.body.login
    const password = req.body.password;

    db.userDatabase.findOne({ where: { login: username } }).then(data=> {
        let user = data;
        if (!user) {
            errors.message = "No Account Found";
            return res.status(400).json(errors);
        }
        let isMatch = password === user.password;

        console.log(username + " - " + password)
        console.log(user.login + " - " + user.password)

        if (!isMatch) {
            errors.message = "Password is incorrect";
            return res.status(400).json(errors);
        }
        const payload = {
            id: user._id,
            username: user.username
        };
        let token = jwt.sign(payload, config.secret, { expiresIn: 36000 });

        // return 500 if token is incorrect
        if (!token) {
            return res.status(500)
                .json({ error: "Error signing token",
                    raw: err });
        }

        return res.json({
            success: true,
            token: `Bearer ${token}` });
    });

});
// router.get('/me', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
//     const username = req.user.username;
//     const dbUser = await User.findOne({ username });
//     res.status(200).json(dbUser);
// });
router.get('/me', passport.authenticate('jwt', {session: false}), async function(req, res, next) {
    const username = "klemanjar0";
    console.log(username);
    await db.userDatabase.findOne({where: {login: username} }).then(data=>{
        res.status(200).json(data);
    });
});
router.get('/user/:login',  async function(req, res) {
    const username = req.params.login;
    await db.userDatabase.findOne({where: {login: username} }).then(data=>{
        res.status(200).json(data);
    });
});


module.exports = router;