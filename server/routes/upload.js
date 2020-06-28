const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

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
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        type === validExtensions[0] ? userImage(id, res, fileName) : productImage(id, res, fileName);

    });
});

function userImage(id, res, fileName) {
    User.findById(id, (err, userDb) => {
        if (err) {
            deleteImage(fileName, validTypes[1]);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            deleteImage(fileName, validTypes[1]);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not exists'
                }
            });
        }

        deleteImage(userDb.img, validTypes[1]);

        userDb.img = fileName;
        userDb.save((err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser
            });
        })

    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productDb) => {
        if (err) {
            deleteImage(fileName, validTypes[0]);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDb) {
            deleteImage(fileName, validTypes[0]);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not exists'
                }
            });
        }

        deleteImage(productDb.img, validTypes[0]);

        productDb.img = fileName;
        productDb.save((err, savedProduct) => {
            res.json({
                ok: true,
                product: savedProduct
            });
        })

    });
}

function deleteImage(nameImg, type) {
    //Delete images
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;