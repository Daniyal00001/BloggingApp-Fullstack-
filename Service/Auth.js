const jwt = require('jsonwebtoken');
const secret = "Dani0988"


// this func is call inn controllers where login is called //  here in this case it is called in models/user.js
// it will generate a token for the user after successful login
function Generatetoken(user) {
    return jwt.sign({ _id: user._id, role: user.role , email: user.email, fullname: user.fullname, profileImgUrl: user.profileImgUrl}, secret);
}


// this func is call in middlewares
function ValidateUser(token) {
    if (!token) return null;
    return jwt.verify(token, secret);
}

module.exports = { Generatetoken, ValidateUser };