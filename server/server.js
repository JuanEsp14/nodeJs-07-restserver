require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Global config routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log("Base dedatos ONLINE");
    });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${3000}`);
})