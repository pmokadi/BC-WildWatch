// User Model - defines the structure of user data in the database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Password will be hashed before saving and never stored as text
    password:{
        type: String,
        required: true,
        minlength: 8,
        select: false, // Exclude password from query results by default
    },

    role: {
        type: String,
        enum: ["student", "admin", "security"],
        default: "student"
    },

    campus: {
        type: String,
        default: "Main Campus - Pretoria"
    }
},
{
    timestamps: true // Automatically add createdAt and updatedAt fields
});

//Hashing the password before saving to database
userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method checking if entered password matches stored hash
userSchema.methods.comparePassword = async function (enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);