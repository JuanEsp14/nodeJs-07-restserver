const express = require('express');
const fs = require('fs');
const path = require('path');
const { validateTokenImg } = require('../middleware/authentication')
let app = express();

app.get('/image/:type/:img', validateTokenImg, (req, err) => {
    let type = req.params.type;
    let img = req.params.img;
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);
    if (fs.existsSync(pathImage)) {
        return res.sendFile(pathImage);
    }
    let noImagePath = path.resolve(__dirname, `../assets/original.jpg`);

    res.sendFile(noImagePath);
});


module.exports = app;