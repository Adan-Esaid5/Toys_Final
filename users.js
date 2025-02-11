require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel.js");

const users = [
  { name: "Adan", email: "Adan@example.com", password: "123", role: "USER"},
  { name: "Ahmad", email: "Ahmad@example.com", password: "456", role: "USER" },
  { name: "Celia", email: "Celiae@example.com", password: "789", role: "ADMIN" },
  { name: "Yamen", email: "Yamen@example.com", password: "147", role: "ADMIN" },
  { name: "Rami", email: "Rami@example.com", password: "258", role: "USER"},
  { name: "Abod", email: "Abod@example.com", password: "369", role: "ADMIN" },
];

const Users = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await User.deleteMany(); 
    const createdUsers = await User.insertMany(users);

    console.log("Users entered successfully:", createdUsers);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error entered users:", error);
    mongoose.connection.close();
  }
};

Users();
