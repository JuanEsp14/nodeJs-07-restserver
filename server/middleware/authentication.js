const jwt = require('jsonwebtoken');

//Validate token
let validateToken = (req, res, next) => {
    //Get token from Header
    let token = req.get('token');
    verifyToken(token, req, res);
    //return to previus function
    next();

};

//Validate role admin
let validateRole = (req, res, next) => {
    //Get user 
    let user = req.user;
    if (user.role != 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: "The user isn't admin"
            }
        });
    }
    //return to previus function
    next();
};

//Validate token for image
let validateTokenImg = (req, res, next) => {
    let token = req.query.token;
    verifyToken(token, req, res);
    //return to previus function
    next();
};

function verifyToken(token, req, res) {
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }
        req.user = decoded.user;
    });
}

module.exports = { validateToken, validateRole, validateTokenImg };