const express = require('express');
const { validateToken } = require('../middleware/authentication');

let app = express();
let Product = require('../models/product')

//Get all products
app.get('/products', validateToken, (req, res) => {
    let to = Number(req.query.to) || 0;
    let from = Number(req.query.from) || 5;

    Product.find({ available: true })
        .skip(to)
        .limit(from)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                products
            })
        })
});

//Get product by id
app.get('/products/:id', validateToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productDb) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `Not found product with ID: ${id}`
                    }
                })
            }

            res.json({
                ok: true,
                product: productDb
            })
        });

});

//Create a new product
app.post('/products', validateToken, (req, res) => {
    let body = req.body;


    let product = new Producto({
        name: body.name,
        price: body.price,
        description: body.description,
        available: true,
        category: body.category,
        user: req.user._id
    });

    product.save((err, productDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            product: productDb
        })
    });
});

//Update a product
app.put('/products/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, { new: true, runValidators: true },
        (err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productDb) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            productDb.name = body.name;
            productDb.price = body.price;
            productDb.category = body.category;
            productDb.available = body.available;
            productDb.description = body.description;

            productDb.save((err, productSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    product: productSaved
                });
            });
        });
});

//delete a product
app.delete('/products/:id', validateToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    body.available = false;

    Product.findByIdAndUpdate(id, body.available, {},
        (err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!productDb) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                product: productDb
            })
        });
});