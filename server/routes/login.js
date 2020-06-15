const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const User = require('../models/user.models');
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

//Google configurations
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
}

app.post('/gooogle', (req, res) => {
    let token = req.body.idtoken;
    verify(token);
    res.json({
        token
    })
});

module.exports = app;