const mongoose = require("mongoose");
const colors = require("colors");
const users = require("./Data/users");
const products = require("./Data/product");
const User = require("./Models/userModel");
const Product = require("./Models/productModel");
const Order = require("./Models/orderModule");
const connectDB = require("./config/DB");
require("dotenv").config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    const createdUser = await User.insertMany(users);
    const adminUser = createdUser[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    await Product.insertMany(sampleProducts);
    console.log("Data imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
