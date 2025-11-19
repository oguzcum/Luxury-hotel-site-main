
const ical = require("ical");
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

async function fetchBookingCalendar(bookingUrl) {
  const url = bookingUrl;
  const response = await fetch(url);
  const icsData = await response.text();

  const parsed = ical.parseICS(icsData);

  const events = Object.values(parsed)
    .filter(e => e.type === "VEVENT")
    .map(e => ({
      start: e.start,
      end: e.end,
      summary: e.summary,
    }));

  return events;
}

app.get("/api/bookings", async (req, res) => {
  try {
    // ICS linkleri burada belirli odalara göre atanmış olsun
    const calendars = [
      { roomName: "Pink Home Oda 1", url: "https://ical.booking.com/v1/export?t=1b4da059-dacb-4204-b810-97a15dafc2de" },
      { roomName: "Pink Home Oda 2", url: "https://ical.booking.com/v1/export?t=5c499ede-3e54-4247-ad7e-3b1858fa8c1d" },
      { roomName: "Pink Home Oda 3", url: "https://ical.booking.com/v1/export?t=230e79ac-88ef-4120-8d40-0e890b80e023" },
      { roomName: "Pink Home Oda 4", url: "https://ical.booking.com/v1/export?t=d7f0b18d-acb6-44b3-93ea-898d2ff7e2e6" },
      { roomName: "Pink Home Oda 5", url: "https://ical.booking.com/v1/export?t=97c8cddb-fdb4-44c2-a376-36a3af4f17ab" },
      { roomName: "Pink Home Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1161664008389716366.ics?s=7d1537dc5be3e4b4554f0224d86e3168" },
      { roomName: "Pink Home Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1161670080306403232.ics?s=379c05339b45ceabc7889ae0d6736b99" },
      { roomName: "Pink Home Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1200111756457610405.ics?s=05223429a42f77b6ef15b186562e3297" },
      { roomName: "Pink Home Oda 4", url: "https://www.airbnb.com.tr/calendar/ical/1428891192444829885.ics?s=0d6630bfd5763a5d0d925acf8ff99014" },
      { roomName: "Pink Home Oda 5", url: "https://www.airbnb.com.tr/calendar/ical/1428939196073293602.ics?s=4f38bf8585bdef2605f4799884881ed5" },
      { roomName: "Artist Antik Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1216412435355275374.ics?s=d7e7aa56a3493672a44eb7b35eec01e7 "},
      { roomName: "Artist Antik Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1204985904090852447.ics?s=6157e2eb75882ede7f9ca08521674d02" },
      { roomName: "Artist Antik Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1204985752944850711.ics?s=d09aa5c00b432e1a419a4da9c729cc8d" },
      { roomName: "Artist Antik Oda 1", url: "https://ical.booking.com/v1/export?t=318b7ab7-416e-44da-964b-dc10621976ff" }
    ];

    
    const results = await Promise.all(
      calendars.map(async (cal) => {
        const events = await fetchBookingCalendar(cal.url);
        return { roomName: cal.roomName, bookings: events };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).json({ error: "Takvim verileri alınamadı" });
  }
});



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
  const { checkIn, checkOut } = req.query;

  try {
    // 1️⃣ Veritabanından tüm odaları çek
    const [rooms] = await pool.query("SELECT * FROM rooms");

    // 2️⃣ ICS linklerinden rezervasyon verilerini al
        const calendars = [
      { roomName: "Pink Home Oda 1", url: "https://ical.booking.com/v1/export?t=1b4da059-dacb-4204-b810-97a15dafc2de" },
      { roomName: "Pink Home Oda 2", url: "https://ical.booking.com/v1/export?t=5c499ede-3e54-4247-ad7e-3b1858fa8c1d" },
      { roomName: "Pink Home Oda 3", url: "https://ical.booking.com/v1/export?t=230e79ac-88ef-4120-8d40-0e890b80e023" },
      { roomName: "Pink Home Oda 4", url: "https://ical.booking.com/v1/export?t=d7f0b18d-acb6-44b3-93ea-898d2ff7e2e6" },
      { roomName: "Pink Home Oda 5", url: "https://ical.booking.com/v1/export?t=97c8cddb-fdb4-44c2-a376-36a3af4f17ab" },
      { roomName: "Pink Home Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1161664008389716366.ics?s=7d1537dc5be3e4b4554f0224d86e3168" },
      { roomName: "Pink Home Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1161670080306403232.ics?s=379c05339b45ceabc7889ae0d6736b99" },
      { roomName: "Pink Home Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1200111756457610405.ics?s=05223429a42f77b6ef15b186562e3297" },
      { roomName: "Pink Home Oda 4", url: "https://www.airbnb.com.tr/calendar/ical/1428891192444829885.ics?s=0d6630bfd5763a5d0d925acf8ff99014" },
      { roomName: "Pink Home Oda 5", url: "https://www.airbnb.com.tr/calendar/ical/1428939196073293602.ics?s=4f38bf8585bdef2605f4799884881ed5" },
      { roomName: "Artist Antik Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1216412435355275374.ics?s=d7e7aa56a3493672a44eb7b35eec01e7 "},
      { roomName: "Artist Antik Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1204985904090852447.ics?s=6157e2eb75882ede7f9ca08521674d02" },
      { roomName: "Artist Antik Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1204985752944850711.ics?s=d09aa5c00b432e1a419a4da9c729cc8d" },
      { roomName: "Artist Antik Oda 1", url: "https://ical.booking.com/v1/export?t=318b7ab7-416e-44da-964b-dc10621976ff" }
    ];


    const calendarData = await Promise.all(
      calendars.map(async (cal) => {
        const bookings = await fetchBookingCalendar(cal.url);
        return { roomName: cal.roomName, bookings };
      })
    );

    // 3️⃣ Eğer tarih belirtilmemişse tüm odaları dön
    if (!checkIn || !checkOut) {
      return res.json(rooms);
    }

    // 4️⃣ Tarihleri parse et
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 5️⃣ Her odanın doluluk durumunu kontrol et
    const availableRooms = rooms.filter((room) => {
  // Aynı isimli (Booking + Airbnb) tüm takvimleri bul
  const matchingCalendars = calendarData.filter(
    (c) => c.roomName.toLowerCase().includes(room.name.toLowerCase())
  );

  if (matchingCalendars.length === 0) return true;

  // Hepsinin rezervasyonlarını tek bir diziye birleştir
  const allBookings = matchingCalendars.flatMap((cal) => cal.bookings);

  // Herhangi biri seçili tarih aralığıyla çakışıyor mu?
  const isBooked = allBookings.some((booking) => {
    const start = new Date(booking.start);
    const end = new Date(booking.end);
    return checkInDate < end && checkOutDate > start;
  });

  return !isBooked;
});

    res.json(availableRooms);
  } catch (err) {
    console.error("Rooms fetch error:", err);
    res.status(500).json({ message: "Oda bilgileri alınamadı" });
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
