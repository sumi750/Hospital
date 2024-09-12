const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//customer Schema
const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type:Number,
        required: true,
    },
    phone:{
        type: Number,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer; 