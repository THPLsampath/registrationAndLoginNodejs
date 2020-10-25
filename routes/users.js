const express = require('express');
const router = express.Router();
const User = require('../models/userfunction');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

//registation route calling
router.post('/register', (req, res) => {
    //creating new object newUser. using for mongodb scheema
    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })

    console.log(newUser);

    //create the function on mongo schema
    User.saveuser(newUser, (err, user) => {
        if (err) {
            res.json({ status: false, mag: "msg is not inscrted" })
        }
        if (user) {
            res.json({ status: true, msg: "data incsrted" })
        }
    })
});

//login routing calling
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, (err, user) => {
        if (err) throw err
        if (!user) {
            res.json({ state: false, msg: "no user found" })
        }

        User.passwordCheck(password, user.password, (err, match) => {
            if (err) throw err

            if (match) {
                console.log("user comming in");
                // console.log(config.secret);
                // console.log(user);
                const token = jwt.sign({ user }, config.secret, { expiresIn: 86400 });
                // console.log(token);
                if (!token) {
                    res.json({
                        state: false,
                        msg: "token is not generate"
                    })
                } else {
                    res.json({
                        state: true,
                        token: "JWT " + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    })
                }
            }
        });
    });
});

router.post('/profile', passport.authenticate('jwt', { session: false }),
    function (req, res) {
        res.json({ user: req.user });
    }
);


module.exports = router;