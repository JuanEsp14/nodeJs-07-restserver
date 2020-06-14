const express = require('express');
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `The email or username ${body.email} do not exist`
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDb.password)) {
            console.log("Your password incorrect");
            return res.status(400).json({
                ok: false,
                err: {
                    message: `The email or username ${body.email} do not exist`
                }
            });
        }

        let token = jwt.sign({
            user: userDb
        }, process.env.SEED_TOKEN, { expiresIn: process.env.TOKEN_DATA_EXPIRED });

        res.json({
            ok: true,
            user: userDb,
            token
        })
    });
});

module.exports = app;