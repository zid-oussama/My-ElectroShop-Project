const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);
    console.log(`connected to DataBase :${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message})`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;
