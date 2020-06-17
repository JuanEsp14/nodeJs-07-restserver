const express = require('express');
let { validateToken, validateRole } = require('../middleware/authentication');

let app = express();

let Category = require('../models/category');

//Get all categories
app.get('/category', validateToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                category: categories
            })
        })
});

//Get categroy by Id
app.get('/category/:id', validateToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Not found category with ID: ${id}`
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDb
        })
    });

});

//Crete new category
app.post('/category', validateToken, (req, res) => {
    let body = req.body;

    let category = new Category({
        description: body.description,
        usuario: req.user._id
    });

    category.save((err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDb
        })
    });
});

//Update category
app.put('/category/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Category.findByIdAndUpdate(id, body.description, { new: true, runValidators: true },
        (err, categoryDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoryDb) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                category: categoryDb
            })
        });
});

//Delete category
app.delete('/category/:id', [validateToken, validateRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndDelete(id, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoryDb) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: "Delated category"
        })
    });
});

module.exports = app;