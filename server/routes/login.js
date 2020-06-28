const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const User = require('../models/user');
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

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/gooogle', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userDb) {
            if (userDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Use your normal authentication`
                    }
                });
            }
            let token = jwt.sign({
                user: userDb
            }, process.env.SEED_TOKEN, { expiresIn: process.env.TOKEN_DATA_EXPIRED });

            return res.json({
                ok: true,
                userDb,
                token
            });
        }

        //Create new user
        let user = new User();
        user.name = googleUser.name;
        user.email = googleUser.email;
        user.img = googleUser.picture;
        user.google = googleUser.google;
        user.password = ':)';

        user.save((err, userDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let token = jwt.sign({
                user: userDb
            }, process.env.SEED_TOKEN, { expiresIn: process.env.TOKEN_DATA_EXPIRED });

            return res.json({
                ok: true,
                userDb,
                token
            });
        });

    });
});

module.exports = app;