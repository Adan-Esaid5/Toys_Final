require("dotenv").config();
const mongoose = require("mongoose");
const Toy = require("./models/toyModel.js"); 

const mongoURI = process.env.MONGO_URI;

const toys = [
  {
    name: "LEGO Classic Set",
    info: "Classic LEGO building blocks set",
    category: "Building",
    img_url: "https://m.media-amazon.com/images/I/81r7X9yG9XL._AC_SX569_.jpg",
    price: 39.99
  },
  {
    name: "Barbie Doll",
    info: "Classic Barbie fashion doll",
    category: "Dolls",
    img_url: "https://m.media-amazon.com/images/I/91v7pJmJ27L._AC_SY679_.jpg",
    price: 25.99
  },
  {
    name: "Hot Wheels Car Set",
    info: "Set of 10 die-cast Hot Wheels cars",
    category: "Vehicles",
    img_url: "https://m.media-amazon.com/images/I/81ZXiHhcnTL._AC_SX569_.jpg",
    price: 14.99
  },
  {
    name: "Nerf Blaster",
    info: "Foam dart gun with soft darts",
    category: "Outdoor",
    img_url: "https://m.media-amazon.com/images/I/81JwNmuEUOL._AC_SX569_.jpg",
    price: 29.99
  },
  {
    name: "Monopoly Board Game",
    info: "Classic family board game",
    category: "Board Games",
    img_url: "https://m.media-amazon.com/images/I/91zjbDPaBPL._AC_SX569_.jpg",
    price: 19.99
  },
  {
    name: "Rubik's Cube",
    info: "3x3 classic Rubik's puzzle cube",
    category: "Puzzle",
    img_url: "https://m.media-amazon.com/images/I/71sF6awDjXL._AC_SY679_.jpg",
    price: 9.99
  },
  {
    name: "Stuffed Teddy Bear",
    info: "Soft and cuddly teddy bear",
    category: "Plush Toys",
    img_url: "https://m.media-amazon.com/images/I/91aFclU1SDL._AC_SY679_.jpg",
    price: 19.99
  },
  {
    name: "Scooby-Doo Puzzle",
    info: "500-piece Scooby-Doo jigsaw puzzle",
    category: "Puzzle",
    img_url: "https://m.media-amazon.com/images/I/81TGT9Fod9L._AC_SX569_.jpg",
    price: 12.99
  },
  {
    name: "Remote Control Car",
    info: "Fast and rechargeable RC car",
    category: "Electronics",
    img_url: "https://m.media-amazon.com/images/I/81qIxJYNE3L._AC_SY450_.jpg",
    price: 49.99
  },
  {
    name: "UNO Card Game",
    info: "Classic card game for all ages",
    category: "Card Games",
    img_url: "https://m.media-amazon.com/images/I/71g6xGZDZmL._AC_SX569_.jpg",
    price: 7.99
  },
  {
    name: "Beyblade Burst",
    info: "Spinning top battle set",
    category: "Classic Toys",
    img_url: "https://m.media-amazon.com/images/I/91cCdwEy3qL._AC_SY679_.jpg",
    price: 22.99
  },
  {
    name: "Pikachu Plush Toy",
    info: "Soft Pikachu from Pokémon",
    category: "Plush Toys",
    img_url: "https://m.media-amazon.com/images/I/81zotllAP2L._AC_SY679_.jpg",
    price: 19.99
  }
];


async function toyDB() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB...");

    await Toy.deleteMany();
    console.log("Old toy data removed!");
    
    await Toy.insertMany(toys);
    console.log("New toy data inserted!");

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error toys database:", error);
    mongoose.connection.close();
  }
}

toyDB();
