require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

// 📌 חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/toyStore", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Failed:", err));

// 📌 **מודל צעצועים**
const ToySchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number
});
const Toy = mongoose.model("Toy", ToySchema);

// 📌 **מודל משתמשים**
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" }
});
const User = mongoose.model("User", UserSchema);

// 📌 **שליפת כל הצעצועים**
app.get("/toys", async (req, res) => {
    try {
        const toys = await Toy.find();
        res.json(toys);
    } catch (error) {
        res.status(500).json({ message: "Error fetching toys", error });
    }
});

// 📌 **הוספת צעצוע חדש**
app.post("/toys", async (req, res) => {
    try {
        const toy = new Toy(req.body);
        await toy.save();
        res.status(201).json(toy);
    } catch (error) {
        res.status(500).json({ message: "Error adding toy", error });
    }
});

// 📌 **עדכון צעצוע**
app.put("/toys/:id", async (req, res) => {
    try {
        const updatedToy = await Toy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedToy);
    } catch (error) {
        res.status(500).json({ message: "Error updating toy", error });
    }
});

// 📌 **מחיקת צעצוע**
app.delete("/toys/:id", async (req, res) => {
    try {
        await Toy.findByIdAndDelete(req.params.id);
        res.json({ message: "Toy deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting toy", error });
    }
});

// 📌 שליפת כל המשתמשים (ללא הצגת סיסמה)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // 🔹 לא מחזירים את השדה "password"
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "❌ Error fetching users", error });
    }
});


// 📌 **הוספת משתמש חדש**
app.post("/users", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // בדיקה אם המשתמש כבר קיים
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // הצפנת סיסמה
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({ message: "User added successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error adding user", error });
    }
});



// 📌 **מחיקת משתמש**
app.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
});

// 📌 **הפעלת השרת**
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//