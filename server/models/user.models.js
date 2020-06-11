const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid rol'
}

let userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, ' The name is required.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is necessary.']
    },
    password: {
        type: String,
        required: [true, 'The password is required.']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//Delete password parameter when return information to user
userSchema.methods.toJSON = function() {
    let userJson = this;
    let userObject = userJson.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('User', userSchema);