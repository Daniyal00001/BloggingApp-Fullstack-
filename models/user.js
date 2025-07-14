const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const ServiceAuthentication = require('../Service/Auth');

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    profileImgUrl: {
        type: String,
        default:"/public/images/profile.png",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

//signin case => hash passward
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next(); // this is a middleware its job is to check if the password is modified

   this.salt = randomBytes(16).toString('hex');
   this.password = createHmac('sha256', this.salt).update(user.password).digest('hex');
   next();
});

// login case =>match passward
userSchema.static("matchpasswardAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email }); // 
    if (!user) throw new Error('User not found');
    const salt = user.salt; // this is from db
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac('sha256', salt).update(password).digest('hex');
    if(userProvidedPassword !== hashedPassword) throw new Error('Password does not match');
    
    // password matched, return jwt token
    const token = ServiceAuthentication.Generatetoken(user);
    return { token };
})

module.exports = model('User', userSchema);