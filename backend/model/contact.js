import mongoose from "mongoose";    
const contactSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true
    },

    mobile: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true
    },

    subject: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    reply: {
        type: String,
        default: null
    },

    reply_date: {
        type: Date,
        default: null
    },

    status: {
        type: String,
        enum: ["pending", "replied"],
        default: "pending"
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    updated_at: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: false
});

module.exports = mongoose.model("Contact", contactSchema);