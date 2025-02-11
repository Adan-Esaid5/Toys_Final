const API_URL_TOYS = "http://localhost:3001/toys";
const API_URL_USERS = "http://localhost:3001/users";

// 📌 פונקציה כללית שבודקת אם האלמנט קיים לפני הטעינה
function elementExists(id) {
    return document.getElementById(id) !== null;
}

// 📌 שליפת כל הצעצועים
const API_URL = "http://localhost:3001/toys";
async function fetchToys() {
    try {
        const response = await fetch(API_URL_TOYS);
        if (!response.ok) throw new Error("❌ Failed to fetch toys");

        const toys = await response.json();
        const toyList = document.getElementById("toyList"); // ודאי שה-ID תואם ב-HTML
        toyList.innerHTML = ""; // מרוקן את הרשימה כדי להוסיף מחדש

        if (toys.length === 0) {
            toyList.innerHTML = `<p class="text-center text-danger">No toys available</p>`;
            return;
        }

        toys.forEach(toy => {
            const card = `<div class="toy-card">
                <img src="${toy.img_url || 'https://via.placeholder.com/300'}" alt="${toy.name}">
                <h5>${toy.name}</h5>
                <p><strong>Category:</strong> ${toy.category}</p>
                <p><strong>Price:</strong> $<input type="number" value="${toy.price.toFixed(2)}" id="price-${toy._id}" class="form-control text-center" disabled></p>
                <div class="actions">
                    <button id="edit-${toy._id}" class="btn btn-warning btn-sm" onclick="editToy('${toy._id}')">Edit</button>
                    <button id="save-${toy._id}" class="btn btn-success btn-sm d-none" onclick="saveToy('${toy._id}')">Save</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteToy('${toy._id}')">Delete</button>
                </div>
            </div>`;
            toyList.innerHTML += card;
        });

    } catch (error) {
        console.error("❌ Error fetching toys:", error);
    }
}



// 📌 שליפת כל המשתמשים
async function fetchUsers() {
    try {
        const response = await fetch(API_URL_USERS);
        if (!response.ok) throw new Error("❌ Failed to fetch users");

        const users = await response.json();
        const userList = document.getElementById("userList");
        userList.innerHTML = "";

        if (users.length === 0) {
            userList.innerHTML = `<p class="text-center text-danger">No users available</p>`;
            return;
        }

        users.forEach(user => {
            const card = `<div class="user-card">
                <h5>${user.name}</h5>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
                <div class="actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            </div>`;
            userList.innerHTML += card;
        });

    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
}


// 📌 הוספת צעצוע חדש
async function addToy() {
    const toy = {
        name: document.getElementById("name").value.trim(),
        info: document.getElementById("info").value.trim(),
        category: document.getElementById("category").value.trim(),
        img_url: document.getElementById("img_url").value.trim(),
        price: parseFloat(document.getElementById("price").value)
    };

    if (!toy.name || !toy.info || !toy.category || isNaN(toy.price)) {
        alert("⚠ Please fill in all fields correctly!");
        return;
    }

    try {
        const response = await fetch(API_URL_TOYS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toy)
        });

        if (!response.ok) throw new Error("❌ Failed to add toy");

        alert("✅ Toy added successfully!");
        document.getElementById("toyForm").reset();
        fetchToys(); // רענון הרשימה
    } catch (error) {
        console.error("❌ Error adding toy:", error);
        alert("❌ Error adding toy!");
    }
}

// 📌 עריכת צעצוע
function editToy(toyId) {
    // מפעיל את השדות לעריכה
    document.getElementById(`price-${toyId}`).disabled = false;

    // מציג את כפתור השמירה
    document.getElementById(`save-${toyId}`).classList.remove("d-none");

    // מסתיר את כפתור העריכה כדי למנוע לחיצה נוספת
    document.getElementById(`edit-${toyId}`).classList.add("d-none");
}


// 📌 שמירת צעצוע לאחר עריכה
async function saveToy(toyId) {
    const updatedToy = {
        name: document.getElementById(`name-${toyId}`)?.value.trim(),
        category: document.getElementById(`category-${toyId}`)?.value.trim(),
        price: parseFloat(document.getElementById(`price-${toyId}`).value)
    };

    try {
        const response = await fetch(`${API_URL_TOYS}/${toyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedToy)
        });

        if (!response.ok) throw new Error("❌ Failed to update toy");

        alert("✅ Toy updated successfully!");

        // מחזיר את הכפתור לעריכה
        document.getElementById(`save-${toyId}`).classList.add("d-none");
        document.getElementById(`edit-${toyId}`).classList.remove("d-none");

        // מנע שינוי נוסף אחרי השמירה
        document.getElementById(`price-${toyId}`).disabled = true;

        // רענון הרשימה
        fetchToys();
    } catch (error) {
        console.error("❌ Error updating toy:", error);
        alert("❌ Error updating toy!");
    }
}


// 📌 מחיקת צעצוע
async function deleteToy(toyId) {
    if (!confirm("🛑 Are you sure you want to delete this toy?")) return;

    try {
        const response = await fetch(`${API_URL_TOYS}/${toyId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("❌ Failed to delete toy");

        alert("✅ Toy deleted successfully!");
        fetchToys();
    } catch (error) {
        console.error("❌ Error deleting toy:", error);
        alert("❌ Error deleting toy!");
    }
}

// הוספת משתמשים 
async function addUser() {
    const user = {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        password: document.getElementById("userPassword").value.trim(),
        role: document.getElementById("userRole").value
    };

    if (!user.name || !user.email || !user.password) {
        alert("⚠ Please fill in all fields!");
        return;
    }

    try {
        const response = await fetch(API_URL_USERS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        if (!response.ok) throw new Error("❌ Failed to add user");

        alert("✅ User added successfully!");
        document.getElementById("userForm").reset();
        fetchUsers(); // רענון הרשימה
    } catch (error) {
        console.error("❌ Error adding user:", error);
        alert("❌ Error adding user!");
    }
}



// 📌 מחיקת משתמש
async function deleteUser(userId) {
    if (!confirm("🛑 Are you sure you want to delete this user?")) return;

    try {
        const response = await fetch(`${API_URL_USERS}/${userId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("❌ Failed to delete user");

        alert("✅ User deleted successfully!");
        fetchUsers();
    } catch (error) {
        console.error("❌ Error deleting user:", error);
        alert("❌ Error deleting user!");
    }
}


// 📌 טעינת הנתונים עם פתיחת הדף
document.addEventListener("DOMContentLoaded", () => {
    fetchToys();
    fetchUsers(); 
});
