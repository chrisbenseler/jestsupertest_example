const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String
}, { timestamps: true })
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) { return next() }
    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})
userSchema.methods.comparePassword = function (candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return next(err);
            next(null, isMatch)
    })
}
module.exports = mongoose.model("user", userSchema)