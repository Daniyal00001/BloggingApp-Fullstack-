
const { ValidateUser } = require("../Service/Auth");

const restrictToLoginOnly = (req, res, next) => {   
    const uid = req.cookies.token;
    if (uid) {
        const user = ValidateUser(uid);
        if (user) {
            req.user = user;
            next();
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports = { restrictToLoginOnly };
