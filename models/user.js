const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique:true
    },
    profile_image: {
        type: String,
    },
    password: {
        type: String,
    },
    date_of_birth: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inActive'],
        default: 'active',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    createdAt: Number,
    updatedAt: Number,
},{
    timestamps: true,
})

module.exports = mongoose.model("user", UserSchema);