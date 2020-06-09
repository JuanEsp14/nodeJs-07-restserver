require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
    if (err) throw err;
    console.log("Base dedatos ONLINE");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${3000}`);
})