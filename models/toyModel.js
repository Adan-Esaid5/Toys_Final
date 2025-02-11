const mongoose = require("mongoose");

const toySchema = new mongoose.Schema({
  name: { type: String, required: true },
  info: { type: String, required: true },
  category: { type: String, required: true },
  img_url: { type: String },
  price: { type: Number, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

//חסר לך joi

module.exports = mongoose.model("Toy", toySchema);