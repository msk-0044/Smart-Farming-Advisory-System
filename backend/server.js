const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= TEST ROUTES ================= */
app.get("/ping", (req, res) => res.send("pong"));
app.get("/test", (req, res) => res.send("SERVER WORKING"));

/* ================= FRONTEND ================= */
const frontendPath = path.join(process.cwd(), "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ================= MYSQL ================= */
let db = null;

try {
  const tempDb = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "smart_farming",
  });

  tempDb.connect((err) => {
    if (err) {
      console.log("⚠️ Running without MySQL (Railway mode)");
      db = null;
    } else {
      console.log("✅ MySQL connected");
      db = tempDb;
    }
  });
} catch (e) {
  console.log("⚠️ MySQL disabled");
  db = null;
}

/* ================= SAFE QUERY ================= */
function safeQuery(res, query, params, callback) {
  if (!db) {
    return res.json({ message: "Server running without database (deploy mode)" });
  }
  db.query(query, params, callback);
}

/* ================= REGISTER FARMER ================= */
app.post("/register", (req, res) => {
  const { name, mobile, password, village, crop } = req.body;

  if (!name || !mobile || !password || !village || !crop)
    return res.status(400).send("All fields required");

  if (!/^\d{10}$/.test(mobile))
    return res.status(400).send("Phone number must be exactly 10 digits");

  const checkQuery = "SELECT * FROM users WHERE mobile_no = ?";
  safeQuery(res, checkQuery, [mobile], (err, result) => {
    if (err) return res.status(500).send("DB error");

    if (result.length > 0)
      return res.status(409).send("Mobile already registered");

    const insertQuery =
      "INSERT INTO users (name, mobile_no, password, village, crop) VALUES (?,?,?,?,?)";

    safeQuery(res, insertQuery, [name, mobile, password, village, crop], (err) => {
      if (err) return res.status(500).send("Insert failed");
      res.send("Registered successfully");
    });
  });
});

/* ================= LOGIN FARMER ================= */
app.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  const query = "SELECT * FROM users WHERE mobile_no = ? AND password = ?";

  safeQuery(res, query, [mobile, password], (err, result) => {
    if (err) return res.status(500).send("DB error");

    if (result.length === 0)
      return res.status(401).send("Invalid mobile or password");

    res.json(result[0]);
  });
});

/* ================= ADMIN LOGIN ================= */
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM admin WHERE email=? AND password=?";

  safeQuery(res, query, [email, password], (err, result) => {
    if (err) return res.status(500).send("DB error");

    if (result.length === 0)
      return res.status(401).send("Invalid admin");

    res.json(result[0]);
  });
});

/* ================= CROP RECOMMEND ================= */
app.post("/crop", (req, res) => {
  const { soil, ph, temp, rain } = req.body;

  let crops = [];

  if (soil === "black") crops.push("Cotton", "Soybean", "Tur");
  if (soil === "loamy") crops.push("Wheat", "Rice", "Maize");
  if (soil === "clay") crops.push("Paddy", "Sugarcane");
  if (soil === "sandy") crops.push("Groundnut", "Millet");

  if (ph < 5.5) crops.push("Potato");
  if (ph > 7.5) crops.push("Barley");

  let season = "Moderate";

  if (temp > 30 && rain > 150) season = "Best for Kharif";
  if (temp < 20) season = "Best for Rabi";

  res.json({ crops: [...new Set(crops)], season });
});

/* ================= FERTILIZER ================= */
app.post("/fertilizer", (req, res) => {
  let { crop, N, P, K } = req.body;
  crop = crop.toLowerCase();

  let plan = "Use balanced NPK fertilizer";
  let alerts = [];

  const n = Number(N);
  const p = Number(P);
  const k = Number(K);

  if (crop === "wheat") {
    plan = "Urea split doses + DAP";
    if (n < 50) alerts.push("Low Nitrogen → add Urea");
    if (p < 30) alerts.push("Low Phosphorus → add DAP");
    if (k < 30) alerts.push("Add MOP for potassium");
  }

  res.json({ plan, alerts });
});

/* ================= DISEASE ================= */
app.post("/disease", (req, res) => {
  const { humidity, temp } = req.body;

  let disease = "Healthy Leaf";
  let risk = "Low";
  let advice = "No disease detected.";

  if (humidity > 75 && temp > 25) {
    disease = "Leaf Blight";
    risk = "High";
    advice = "Spray Mancozeb or neem oil.";
  } else if (humidity > 60) {
    disease = "Powdery Mildew";
    risk = "Medium";
    advice = "Use sulfur spray.";
  }

  res.json({ disease, risk, advice });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
