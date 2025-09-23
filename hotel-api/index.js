require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// DB bağlantısı
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// JWT secret key
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// 🔹 Middleware: Token kontrolü
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 🔹 Admin login
app.post("/api/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    const token = jwt.sign(
      { id: rows[0].id, username: rows[0].username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 🔹 Odaları listele (herkese açık)
app.get("/api/rooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rooms");
    res.json(rows);
  } catch (err) {
    console.error("Rooms fetch error:", err);
    res.status(500).json({ error: "Odalar yüklenemedi" });
  }
});

// 🔹 Oda görselleri
app.get("/api/room_images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT image_path FROM room_images WHERE room_id = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Room images fetch error:", err);
    res.status(500).json({ error: "Oda görselleri yüklenemedi" });
  }
});

// 🔹 Fiyat / açıklama güncelle (Admin)
app.put("/api/rooms/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { price, description } = req.body;

  if (!price && !description) {
    return res.status(400).json({ error: "Güncellenecek veri girilmedi" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE rooms SET price = COALESCE(?, price), description = COALESCE(?, description) WHERE id = ?",
      [price ?? null, description ?? null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Oda bulunamadı" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

// 🔹 Sunucu başlat
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
