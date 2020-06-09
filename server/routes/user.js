const express = require('express');
const app = express();

app.get('/users', function(req, res) {
    res.json('get Users')
});

app.post('/users', function(req, res) {
    //Transforming information from request body with 
    //"Body Parser" library
    if (req.body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'Name is necesary'
        });
    }
    res.json({
        person: req.body
    })
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