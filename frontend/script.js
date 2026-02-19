// ================== LOCAL "DATABASE" KEYS ==================

const FARMERS_KEY = "sf_farmers_db";
const CURRENT_FARMER_KEY = "sf_current_farmer";
const ADMIN_KEY = "sf_admin";
const API = "";


// ================== FARMER REGISTRATION (UPDATED FOR BACKEND) ==================

function registerFarmer(event) {
  event.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const mobile = document.getElementById("regMobile").value.trim();
  const village = document.getElementById("regVillage").value.trim();
  const crop = document.getElementById("regCrop").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const msg = document.getElementById("regMessage");

  msg.className = "sf-message";

  // 🔴 MOBILE VALIDATION
  if (!/^\d{10}$/.test(mobile)) {
    msg.textContent = "Mobile number must be exactly 10 digits";
    msg.classList.add("sf-message--error");
    return;
  }

  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mobile, password, village, crop }),
  })
    .then(async (res) => {
      const text = await res.text();
      msg.textContent = text;

      if (res.ok) {
        msg.classList.add("sf-message--success");

        setTimeout(() => {
          window.location.href = "farmer-login.html";
        }, 1000);
      } else {
        msg.classList.add("sf-message--error");
      }
    })
    .catch(() => {
      msg.textContent = "Server error";
      msg.classList.add("sf-message--error");
    });
}

// ================== FARMER LOGIN (UPDATED FOR BACKEND) ==================

function loginFarmer(event) {
  event.preventDefault();

  const mobile = document.getElementById("loginMobile").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const msg = document.getElementById("loginMessage");

  msg.className = "sf-message";

  fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid login");
      return res.json();
    })
    .then((user) => {
      // save session
      localStorage.setItem("sf_current_farmer", JSON.stringify(user));

      msg.textContent = "Login successful!";
      msg.classList.add("sf-message--success");

      setTimeout(() => {
        window.location.href = "farmer-dashboard.html";
      }, 800);
    })
    .catch(() => {
      msg.textContent = "Invalid mobile or password";
      msg.classList.add("sf-message--error");
    });
}

// ================== ADMIN LOGIN ==================

function loginAdmin(event) {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const msg = document.getElementById("adminMessage");

  msg.className = "sf-message";

  fetch(API + "/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(() => {
      sessionStorage.setItem("admin_logged", "true");

      msg.textContent = "Admin login successful";
      msg.classList.add("sf-message--success");

      setTimeout(() => {
        window.location.href = "admin-dashboard.html";
      }, 800);
    })
    .catch(() => {
      msg.textContent = "Invalid admin credentials";
      msg.classList.add("sf-message--error");
    });
}

// ================== CROP RECOMMENDATION ==================

async function recommendCrop() {
  const soil = document.getElementById("soilType").value;
  const ph = document.getElementById("ph").value;
  const temp = document.getElementById("temp").value;
  const rain = document.getElementById("rainfall").value;

  const box = document.getElementById("cropResult");

  if (!soil || !ph || !temp || !rain) {
    box.style.display = "block";
    box.innerHTML = "⚠️ Please fill all fields";
    return;
  }

  try {
    const res = await fetch(API + "/crop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soil, ph, temp, rain }),
    });

    const data = await res.json();
    console.log("CROP DATA:", data);

    box.style.display = "block";
    box.innerHTML = `
      <b>Recommended Crops:</b> ${data.crops.join(", ")} <br>
      <b>Season:</b> ${data.season}
    `;
  } catch {
    box.style.display = "block";
    box.innerHTML = "❌ Server error";
  }
}

// ================== FERTILIZER ADVICE ==================

async function recommendFertilizer() {
  const crop = document.getElementById("cropType").value;
  const N = document.getElementById("nitrogen").value;
  const P = document.getElementById("phosphorus").value;
  const K = document.getElementById("potassium").value;

  const box = document.getElementById("fertilizerResult");

  if (!crop || !N || !P || !K) {
    box.style.display = "block";
    box.innerHTML = "⚠️ Fill all fields";
    return;
  }

  try {
    const res = await fetch(API + "/fertilizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, N, P, K }),
    });

    const data = await res.json();
    // ===== SAVE SOIL DATA FOR ADMIN =====
    const farmerRaw = localStorage.getItem("sf_current_farmer");

    if (farmerRaw) {
      const farmer = JSON.parse(farmerRaw);

      fetch(API + "/save-soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmer.name,
          nitrogen: N,
          phosphorus: P,
          potassium: K,
          ph: document.getElementById("ph").value,
        }),
      });
    }

    box.style.display = "block";
    box.innerHTML = `
      <b>Plan:</b> ${data.plan} <br>
      <b>Alerts:</b> ${data.alerts.join(", ") || "None"}
    `;
  } catch {
    box.style.display = "block";
    box.innerHTML = "❌ Server error";
  }
}

// ================== DISEASE DETECTION ==================

// Quick demo result button (no image)
function quickDemoDisease() {
  const diseaseBox = document.getElementById("diseaseResult");
  const adviceBox = document.getElementById("treatmentAdvice");
  const riskBox = document.getElementById("riskLevel");
  const spreadBox = document.getElementById("spreadPrediction");

  diseaseBox.style.display = "block";
  adviceBox.style.display = "block";
  riskBox.style.display = "block";
  spreadBox.style.display = "block";

  diseaseBox.innerHTML = "<b>Disease:</b> Early Blight";
  riskBox.innerHTML = "<b>Risk:</b> High";
  adviceBox.innerHTML = "<b>Advice:</b> Spray neem oil or Mancozeb.";
  spreadBox.innerHTML = "High spread risk next 5 days.";
}

// Main detection: leaf validation + (demo) disease result

// ======================================================
// DISEASE DETECTION (FINAL WORKING VERSION)
// ======================================================

async function detectDisease() {
  const cropSelect = document.getElementById("detectCrop");
  const fileInput = document.getElementById("leafImage");

  const diseaseBox = document.getElementById("diseaseResult");
  const adviceBox = document.getElementById("treatmentAdvice");
  const riskBox = document.getElementById("riskLevel");
  const spreadBox = document.getElementById("spreadPrediction");

  // hide old results
  diseaseBox.style.display = "none";
  adviceBox.style.display = "none";
  riskBox.style.display = "none";
  spreadBox.style.display = "none";

  // 🔴 VALIDATE CROP
  if (!cropSelect.value) {
    diseaseBox.style.display = "block";
    diseaseBox.innerHTML = "⚠️ Please select crop";
    return;
  }

  // 🔴 VALIDATE IMAGE
  if (!fileInput.files.length) {
    diseaseBox.style.display = "block";
    diseaseBox.innerHTML = "⚠️ Please upload an image first";
    return;
  }

  const file = fileInput.files[0];

  diseaseBox.style.display = "block";
  diseaseBox.innerHTML = "Analyzing image...";

  const result = await analyzeLeafImage(file);
  console.log("RESULT:", result);

  if (!result || result.error) {
    diseaseBox.innerHTML = "❌ Could not analyze image";
    return;
  }

  if (!result.isLeaf) {
    diseaseBox.innerHTML = "❌ This is not a plant leaf image";
    return;
  }

  // show all boxes now
  diseaseBox.style.display = "block";
  adviceBox.style.display = "block";
  riskBox.style.display = "block";
  spreadBox.style.display = "block";

  // 🌿 HEALTHY
  if (result.type === "healthy") {
    diseaseBox.innerHTML = "<b>Disease:</b> Healthy Leaf";
    riskBox.innerHTML = "<b>Risk:</b> Low";
    adviceBox.innerHTML =
      "<b>Advice:</b> Leaf looks healthy. Maintain nutrients.";
    spreadBox.innerHTML = "No spread risk.";

    saveDiseaseReport("Healthy Leaf", "Low", 95);

    return;
  }

  // 🟡 DEFICIENCY
  if (result.type === "yellow") {
    diseaseBox.innerHTML = "<b>Disease:</b> Nutrient Deficiency";
    riskBox.innerHTML = "<b>Risk:</b> Medium";
    adviceBox.innerHTML = "<b>Advice:</b> Add nitrogen fertilizer.";
    spreadBox.innerHTML = "Can worsen if ignored.";

    saveDiseaseReport("Nutrient Deficiency", "Medium", 85);

    return;
  }

  // 🟤 BLIGHT
  if (result.type === "brown") {
    diseaseBox.innerHTML = "<b>Disease:</b> Leaf Blight";
    riskBox.innerHTML = "<b>Risk:</b> High";
    adviceBox.innerHTML = "<b>Advice:</b> Spray Mancozeb or neem oil.";
    spreadBox.innerHTML = "Spreads fast in humidity.";

    saveDiseaseReport("Leaf Blight", "High", 92);

    return;
  }

  // ⚪ MILDEW
  if (result.type === "white") {
    diseaseBox.innerHTML = "<b>Disease:</b> Powdery Mildew";
    riskBox.innerHTML = "<b>Risk:</b> Medium";
    adviceBox.innerHTML = "<b>Advice:</b> Use sulfur spray.";
    spreadBox.innerHTML = "Moderate spread.";

    saveDiseaseReport("Powdery Mildew", "Medium", 88);

    return;
  }
}

function saveDiseaseReport(disease, risk, confidence = 90) {
  const farmerRaw = localStorage.getItem("sf_current_farmer");
  if (!farmerRaw) return;

  const farmer = JSON.parse(farmerRaw);

  // 🟢 GET CROP FROM INPUT
  const cropInput = document.getElementById("detectCrop");
  const crop =
    cropInput && cropInput.value ? cropInput.value : farmer.crop || "Unknown";

  fetch(API + "/save-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      farmer_name: farmer.name,
      crop: crop,
      disease,
      confidence,
      risk,
    }),
  });
}

// ======================================================
// IMAGE ANALYSIS
// ======================================================

function analyzeLeafImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 100;
        canvas.height = 100;

        ctx.drawImage(img, 0, 0, 100, 100);
        const data = ctx.getImageData(0, 0, 100, 100).data;

        let green = 0,
          yellow = 0,
          brown = 0,
          white = 0,
          total = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r + g + b < 60) continue;
          total++;

          if (g > r + 20 && g > b + 20) green++;
          if (r > 180 && g > 180 && b < 120) yellow++;
          if (r > 100 && g < 80 && b < 80) brown++;
          if (r > 220 && g > 220 && b > 220) white++;
        }

        if (total === 0) return resolve(null);

        const greenRatio = green / total;

        if (greenRatio < 0.1) return resolve({ isLeaf: false });

        if (brown > green * 0.2)
          return resolve({ isLeaf: true, type: "brown" });

        if (yellow > green * 0.2)
          return resolve({ isLeaf: true, type: "yellow" });

        if (white > green * 0.2)
          return resolve({ isLeaf: true, type: "white" });

        resolve({ isLeaf: true, type: "healthy" });
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}

// ========== PREVENTION TIPS ==========

function showTips() {
  const box = document.getElementById("tipsResult");
  if (!box) return;
  box.style.display = "block";
  box.innerHTML = `
    <b>General Prevention & Field Health Tips:</b><br />
   • Use certified, disease-free seeds and follow proper seed treatment procedures.<br />
• Practice proper crop rotation—avoid growing the same crop repeatedly in the same field.<br />
• Prevent waterlogging and maintain an effective drainage system in the field.<br />
• Apply balanced fertilizers—excess nitrogen can increase the risk of disease.<br />
• Promptly remove infected leaves or plants and dispose of them outside the field.<br />
• Apply fungicides or pesticides only when needed, always following the recommended dosage and application intervals.<br />

  `;
}

// ================= SHOW LOGGED FARMER =================
window.addEventListener("DOMContentLoaded", () => {
  const nameBox = document.getElementById("loggedUser");
  if (!nameBox) return;

  const farmerRaw = localStorage.getItem("sf_current_farmer");

  if (!farmerRaw) {
    nameBox.textContent = "Not logged in";
    return;
  }

  const farmer = JSON.parse(farmerRaw);
  nameBox.innerHTML = `👨‍🌾 Logged in as: <b>${farmer.name}</b>`;
});

// ⭐ NEW: FARMER LOGOUT FUNCTION ⭐
// ===============================
function logoutFarmer() {
  localStorage.removeItem("sf_current_farmer");

  alert("You have been logged out.");

  // Redirect to login page
  window.location.href = "farmer-login.html";
}

// Password Show / Hide

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// ================== ADMIN DASHBOARD LOAD ==================
window.addEventListener("DOMContentLoaded", () => {
  const box = document.getElementById("adminFarmersCount");
  if (!box) return;

  fetch(API + "/admin-stats")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("adminFarmersCount").innerText = data.farmers;
      document.getElementById("scanCount").innerText = data.scans;
      document.getElementById("avgConfidence").innerText =
        data.confidence + "%";
    })
    .catch((err) => {
      console.log(err);
      box.innerText = "0";
    });
});

// ================== LOAD DISEASE TABLE (ADMIN) ==================
window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("diseaseTableBody");
  if (!tableBody) return;

  fetch(API + "/admin-disease")
    .then((res) => res.json())
    .then((rows) => {
      tableBody.innerHTML = "";

      rows.forEach((r) => {
        const date = new Date(r.report_date).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        tableBody.innerHTML += `
          <tr>
            <td>${r.farmer_name}</td>
            <td>${r.crop}</td>
            <td>${r.disease}</td>
            <td>${r.confidence}%</td>
            <td>${r.risk}</td>
            <td>${date}</td>
          </tr>
        `;
      });
    })
    .catch((err) => console.log("Disease fetch error", err));
});

// Delete Farmers

function deleteFarmer(id) {
  if (!confirm("Delete farmer?")) return;

  fetch(API + "/admin-farmers/" + id, { method: "DELETE" }).then(() =>
    location.reload(),
  );
}

window.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("diseaseChart");
  if (!ctx) return;

  fetch(API + "/admin-disease-stats")
    .then((res) => res.json())
    .then((data) => {
      const labels = data.map((d) => d.disease);
      const counts = data.map((d) => d.count);

      new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Disease Reports",
              data: counts,
            },
          ],
        },
      });
    });
});

// ================= Soil TABLE =================

window.addEventListener("DOMContentLoaded", () => {
  const body = document.getElementById("soilTableBody");
  if (!body) return;

  fetch(API + "/admin-soil")
    .then((res) => res.json())
    .then((rows) => {
      body.innerHTML = "";

      if (!rows.length) {
        body.innerHTML = `<tr><td colspan="6">No soil records</td></tr>`;
        return;
      }

      rows.forEach((r) => {
        const date = new Date(r.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        body.innerHTML += `
          <tr>
            <td>${r.farmer_name}</td>
            <td>${r.nitrogen}</td>
            <td>${r.phosphorus}</td>
            <td>${r.potassium}</td>
            <td>${r.ph}</td>
            <td>${date}</td>
          </tr>
        `;
      });
    })
    .catch((err) => {
      console.log("SOIL FETCH ERROR:", err);
      body.innerHTML = `<tr><td colspan="6">Error loading data</td></tr>`;
    });
});

// ================= FARMERS TABLE =================
function loadFarmers() {
  const table = document.getElementById("farmersTableBody");
  const search = document.getElementById("farmerSearch");

  if (!table) return;

  let farmersData = [];

  function render(rows) {
    table.innerHTML = "";

    rows.forEach((f) => {
      table.innerHTML += `
        <tr>
          <td>${f.name}</td>
          <td>${f.mobile_no}</td>
          <td>${f.village}</td>
          <td>${f.crop}</td>
          <td>
            <button onclick="deleteFarmer(${f.uid})"
              style="background:#e74c3c;color:white;border:none;padding:6px 10px;border-radius:6px;cursor:pointer">
              Delete
            </button>
          </td>
        </tr>
      `;
    });
  }

  // 🔹 FETCH FARMERS
  fetch(API + "/admin-farmers")
    .then((res) => res.json())
    .then((data) => {
      farmersData = data;
      render(data);
    });

  // 🔹 SEARCH FILTER
  if (search) {
    search.addEventListener("input", () => {
      const val = search.value.toLowerCase();

      const filtered = farmersData.filter(
        (f) =>
          f.name.toLowerCase().includes(val) ||
          String(f.mobile_no).includes(val) ||
          (f.village && f.village.toLowerCase().includes(val)) ||
          (f.crop && f.crop.toLowerCase().includes(val)),
      );

      render(filtered);
    });
  }
}

window.addEventListener("DOMContentLoaded", loadFarmers);

window.addEventListener("DOMContentLoaded", loadFarmers);
