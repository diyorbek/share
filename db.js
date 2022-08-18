const mongoose = require("mongoose");

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URL, {
      useNewUrlParser: true,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
