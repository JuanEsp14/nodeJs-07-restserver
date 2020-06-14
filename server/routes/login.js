const express = require('express');
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const app = express();

app.post('/login', (req, res) => {
    res.json({
        ok: true
    })
});

module.exports = app;