// Connecting our app to MongoDB using Mongoose

const mongoose = require("mongoose");

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
}

module.exports = connectDB;