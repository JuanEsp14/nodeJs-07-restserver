const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user')

//Valid extensions
let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
//Valid types
let validTypes = ['products', 'users'];

//Default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;

    if (!req.files)
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            });
    let file = req.files.file;
    let fileNameCompound = file.name.split('.');
    let extension = fileNameCompound[fileNameCompound.length - 1];

    if (validExtensions.indexOf(extension)) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Valid extensions are: ' + validExtensions.join(', ')
                }
            })
    }

    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Valid types are: ' + validTypes.join(', ')
                }
            })
    }

    //Changed file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    file.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        res.json({
            ok: true,
            message: 'File uploaded!'
        });
    });
});

module.exports = app;