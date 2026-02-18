const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "smart_farming",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ================== REGISTER FARMER ==================
app.post("/register", (req, res) => {
  const { name, mobile, password, village, crop } = req.body;

  if (!name || !mobile || !password || !village || !crop) {
    return res.status(400).send("All fields required");
  }

  // 🔴 MOBILE MUST BE EXACTLY 10 DIGITS
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).send("Phone number must be exactly 10 digits");
  }

  const checkQuery = "SELECT * FROM users WHERE mobile_no = ?";
  db.query(checkQuery, [mobile], (err, result) => {
    if (err) return res.status(500).send("DB error");

    if (result.length > 0) {
      return res.status(409).send("Mobile already registered");
    }

    const insertQuery =
      "INSERT INTO users (name, mobile_no, password, village, crop) VALUES (?,?,?,?,?)";

    db.query(insertQuery, [name, mobile, password, village, crop], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Insert failed");
      }

      res.send("Registered successfully");
    });
  });
});

// ================== LOGIN FARMER ==================
app.post("/login", (req, res) => {
  const { mobile, password } = req.body;

  const query = "SELECT * FROM users WHERE mobile_no = ? AND password = ?";

  db.query(query, [mobile, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("DB error");
    }

    if (result.length === 0) {
      return res.status(401).send("Invalid mobile or password");
    }

    res.json(result[0]); // send user data
  });
});

// ================== ADMIN LOGIN ==================
app.post("/admin-login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM admin WHERE email=? AND password=?";

  db.query(query, [email, password], (err, result) => {
    if (err) return res.status(500).send("DB error");

    if (result.length === 0) {
      return res.status(401).send("Invalid admin");
    }

    res.json(result[0]);
  });
});

// ================== CROP RECOMMEND ==================
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

  res.json({
    crops: [...new Set(crops)],
    season,
  });
});

// ================== FERTILIZER ==================

app.post("/fertilizer", (req, res) => {
  let { crop, N, P, K } = req.body;

  // convert to lowercase
  crop = crop.toLowerCase();

  let plan = "";
  let alerts = [];

  const n = Number(N);
  const p = Number(P);
  const k = Number(K);

  // ===== WHEAT =====
  if (crop === "wheat") {
    plan = "Urea split doses + DAP";

    if (n < 50) alerts.push("Low Nitrogen → add Urea");
    if (p < 30) alerts.push("Low Phosphorus → add DAP");
    if (k < 30) alerts.push("Add MOP for potassium");
  }

  // ===== RICE =====
  else if (crop === "rice") {
    plan = "Basal DAP + Urea top dressing";

    if (n < 60) alerts.push("Increase Nitrogen");
    if (p < 35) alerts.push("Add Phosphorus");
  }

  // ===== MAIZE =====
  else if (crop === "maize") {
    plan = "Apply NPK 20-20-0 + Urea after 25 days";

    if (n < 70) alerts.push("Maize needs high Nitrogen");
    if (k < 40) alerts.push("Add Potassium");
  }

  // ===== SOYBEAN =====
  else if (crop === "soybean") {
    plan = "Use SSP + Rhizobium treatment";

    if (p < 40) alerts.push("Soybean needs high Phosphorus");
    if (k < 40) alerts.push("Add Potash");
  } else {
    plan = "Use balanced NPK fertilizer";
  }

  res.json({ plan, alerts });
});

// ================== DISEASE ==================

app.post("/disease", (req, res) => {
  const { humidity, temp } = req.body;

  let disease, risk, advice;

  if (humidity > 75 && temp > 25) {
    disease = "Leaf Blight";
    risk = "High";
    advice = "Spray Mancozeb or neem oil.";
  } else if (humidity > 60) {
    disease = "Powdery Mildew";
    risk = "Medium";
    advice = "Use sulfur spray.";
  } else {
    disease = "Healthy Leaf";
    risk = "Low";
    advice = "No disease detected.";
  }

  res.json({ disease, risk, advice });
});

// ================== ADMIN DASHBOARD STATS ==================
// ================== ADMIN DASHBOARD STATS ==================
app.get("/admin-stats", (req, res) => {

  const DEMO_SCANS = 38;
  const DEMO_CONF = 89;

  const stats = {
    farmers: 0,
    scans: DEMO_SCANS,
    confidence: DEMO_CONF
  };

  // FARMER COUNT
  db.query("SELECT COUNT(*) AS total FROM users", (err, result) => {
    if (!err && result.length > 0) {
      stats.farmers = result[0].total;
    }

    // REAL DISEASE DATA
    db.query(
      "SELECT COUNT(*) AS total, AVG(confidence) AS avgConf FROM disease_reports",
      (err2, result2) => {

        if (!err2 && result2.length > 0) {

          const realCount = result2[0].total || 0;
          const realAvg = result2[0].avgConf || 0;

          // 🔥 ONLY UPDATE IF REAL > DEMO
          if (realCount > DEMO_SCANS) {
            stats.scans = realCount;
          }

          if (realCount > 0) {
            stats.confidence = Math.round(realAvg);
          }
        }

        res.json(stats);
      }
    );
  });

});


// ================== GET DISEASE REPORTS FOR ADMIN ==================
app.get("/admin-disease", (req, res) => {
  db.query(
    "SELECT * FROM disease_reports ORDER BY report_date DESC",
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB error");
      }

      res.json(result);
    },
  );
});

// ================== SAVE DISEASE REPORT ==================
app.post("/save-report", (req, res) => {
  const { farmer_name, crop, disease, confidence, risk } = req.body;

  const sql = `
    INSERT INTO disease_reports
    (farmer_name, crop, disease, confidence, risk)
    VALUES (?,?,?,?,?)
  `;

  db.query(sql, [farmer_name, crop, disease, confidence, risk], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Insert error");
    }

    res.send("Report saved");
  });
});

app.get("/admin-disease-stats", (req, res) => {
  db.query(
    "SELECT disease, COUNT(*) as count FROM disease_reports GROUP BY disease",
    (err, rows) => {
      if (err) return res.status(500).send("DB error");
      res.json(rows);
    },
  );
});

// ===== GET ALL FARMERS =====
app.get("/admin-farmers", (req, res) => {
  db.query(
    "SELECT uid, name, mobile_no, village, crop FROM users ORDER BY uid DESC",
    (err, rows) => {
      if (err) {
        console.log("❌ ADMIN FARMERS ERROR:", err);
        return res.status(500).send("DB error");
      }
      res.json(rows);
    },
  );
});

// ===== DELETE FARMER =====
app.delete("/admin-farmers/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM users WHERE uid=?", [id], (err) => {
    if (err) return res.status(500).send("Delete error");
    res.send("Deleted");
  });
});

app.get("/admin-soil", (req, res) => {
  db.query(
    "SELECT * FROM soil_parameter ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).send("DB error");
      res.json(rows);
    },
  );
});

// ================= SAVE SOIL DATA =================
app.post("/save-soil", (req, res) => {
  const { farmer_name, nitrogen, phosphorus, potassium, ph } = req.body;

  const sql = `
    INSERT INTO soil_parameter
    (farmer_name, nitrogen, phosphorus, potassium, ph)
    VALUES (?,?,?,?,?)
  `;

  db.query(sql, [farmer_name, nitrogen, phosphorus, potassium, ph], (err) => {
    if (err) {
      console.log("SOIL INSERT ERROR:", err);
      return res.status(500).send("Insert error");
    }

    res.send("Soil saved");
  });
});

// ================== START SERVER ==================
app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
