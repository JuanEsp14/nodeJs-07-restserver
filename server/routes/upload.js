const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

//Default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload', function(req, res) {
    if (!req.files)
        return req.statusCode(400)
            .json({
                ok: false,
                err: {
                    message: 'No files were uploaded.'
                }
            });
    let file = req.files.file;

    file.mv('uploads/filename.png', (err) => {
        if (err)
            return req.statusCode(500)
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