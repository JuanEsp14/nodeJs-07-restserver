const express = require('express');
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const app = express();

app.get('/users', function(req, res) {
    res.json('get Users')
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
    res.json({
        id
    })
});

app.delete('/users', function(req, res) {
    res.json('delete Usuario')
});

module.exports = app;