const express = require('express');
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
//added functions to JS
const _ = require('underscore');
const app = express();

app.get('/users', function(req, res) {
    let to = Number(req.query.to) || 0;
    let from = Number(req.query.from) || 5;

    //The second parameter indicates that it will be shown to users
    User.find({}, 'name email role state google img')
        .skip(to)
        .limit(from)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }

            User.count({}, (err, quantity) => {
                res.json({
                    ok: true,
                    users,
                    quantity
                });
            })


        });
});

app.post('/users', function(req, res) {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        role: req.body.role
    });

    //Save user in the data base with Mongoose. This library
    //returns an error (if cannot save) or a model (if can save)
    user.save((err, userDb) => {
        console.log(err);
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }

        res.json({
            ok: true,
            person: userDb
        })
    });

    //Transforming information from request body with 
    //"Body Parser" library
    // if (req.body.name === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Name is necesary'
    //     });
    // }
    // res.json({
    //     person: req.body
    // })
});

app.put('/users/:id', function(req, res) {

    let id = req.params.id;
    //Parameters that can update are
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);





    //In the third param (options) indicated if the object userDb is
    //the new or if this is de object before to update
    //runValidators run the validations that are in the models
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDb
        })
    });

});

app.delete('/users/:id', function(req, res) {
    let id = req.params.id;

    //Removed user complete
    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not exists'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        })
    });
});

module.exports = app;