const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {type: String, required:true, unique:true},
        username:{type: String, required:true},
        password:{type: String, required:true, min:6},

    }
)
UserSchema.virtual('url').get(function(){
    return this._id;
})
module.exports = mongoose.model('User', UserSchema)