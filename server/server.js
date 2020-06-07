const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuarios', function(req, res) {
    res.json('get Usuario')
});

app.post('/usuarios', function(req, res) {
    //Transforming information from request body with 
    //"Body Parser" library
    res.json({
        person: req.body
    })
});

app.put('/usuarios/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    })
});

app.delete('/usuarios', function(req, res) {
    res.json('delete Usuario')
});

app.listen(3000, () => {
    console.log("Escuchando puerto 3000");
})