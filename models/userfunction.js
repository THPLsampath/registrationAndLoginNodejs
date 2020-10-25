const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String },
    name: { type: String },
    email: { type: String },
    password: { type: String },
});

const User = module.exports = mongoose.model('User', userSchema);

//hash the password using npm package bcryptjs 'https://www.npmjs.com/package/bcryptjs'
module.exports.saveuser = (newUser, callback) => {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            if (err) throw err
            newUser.save(callback);
        });
    });
}

module.exports.findByEmail = (email, callback) => {
    const query = { email: email };
    User.findOne(query, callback);
}

module.exports.passwordCheck = (password, hash, callback) => {
    bcrypt.compare(password, hash, function (err, res) {
        if (err) throw err
        if (res) {
            callback(null, res);
        }
    });
}

module.exports.findUserById = (id, callback) => {
    User.findOne(id, callback);
}