const ical = require("ical");
const icalGenerator = require("ical-generator").default;
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // <--- DEĞİŞİKLİK: Axios eklendi

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

// --- SABİT VERİLER (ICS Linkleri) ---
const CALENDAR_URLS = [
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
  { roomName: "Artist Antik Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1216412435355275374.ics?s=d7e7aa56a3493672a44eb7b35eec01e7 " },
  { roomName: "Artist Antik Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1204985904090852447.ics?s=6157e2eb75882ede7f9ca08521674d02" },
  { roomName: "Artist Antik Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1204985752944850711.ics?s=d09aa5c00b432e1a419a4da9c729cc8d" },
  { roomName: "Artist Antik Oda 1", url: "https://ical.booking.com/v1/export?t=318b7ab7-416e-44da-964b-dc10621976ff" }
];

// --- PERFORMANS VE CACHE SİSTEMİ ---
let calendarCache = {
  data: [],          
  lastUpdated: 0,    
  isUpdating: false  
};
// --- DEBUG: SADECE ICS (DIŞ KAYNAK) VERİLERİNİ GÖR ---
// Tarayıcıdan http://localhost:4000/api/bookings adresine girince çalışır.
app.get("/api/bookings", async (req, res) => {
  try {
    // 1. ADIM: Dış Kaynaklardan (Airbnb & Booking) Gelen Veriler
    const externalCalendars = await Promise.all(
      CALENDAR_URLS.map(async (cal) => {
        const events = await fetchBookingCalendar(cal.url);
        return { 
            source: "DIŞ KAYNAK (Airbnb/Booking)",
            roomName: cal.roomName, 
            url: cal.url, 
            totalEvents: events.length,
            bookings: events 
        };
      })
    );

    // 2. ADIM: İç Kaynaklardan Oluşturulan Veriler
    // Önce sistemdeki odaları çekelim
    const [dbRooms] = await pool.query("SELECT id, name FROM rooms");
    
    // Her oda için "Sanal ICS" verisi oluşturalım
    const localCalendars = await Promise.all(
        dbRooms.map(async (room) => {
            // Bu odanın aktif (reddedilmemiş) rezervasyonlarını çek
            const [bookings] = await pool.query(
                "SELECT * FROM bookings WHERE room_id = ? AND status != 'rejected'",
                [room.id]
            );

            // Verileri ICS formatına (start/end/summary) benzetelim
            const events = bookings.map(b => {
                 // Opsiyon süresi (5 gün) kontrolü
                 const createdTime = new Date(b.created_at).getTime();
                 const now = new Date().getTime();
                 const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
                 const isExpired = (b.status === 'pending') && ((now - createdTime) > fiveDaysMs);

                 if (isExpired) return null; // Süresi dolmuşsa listeye ekleme

                 return {
                     start: b.check_in, // MySQL Date objesi
                     end: b.check_out,
                     summary: `YEREL REZERVASYON: ${b.customer_name} (${b.status})`
                 };
            }).filter(e => e !== null); // Null olanları temizle

            // Airbnb'ye vereceğin linki dinamik olarak oluştur
            // NOT: Sunucunu canlıya aldığında 'localhost:4000' yerine 'siteadresin.com' yazmalısın.
            const sitename = "localhost:4000";
            const exportUrl = `http://`+sitename+`/api/export-ical/${room.id}`;

            return {
                source: "YEREL (SENİN SİTEN)",
                roomName: room.name,
                url: exportUrl, // 👈 İŞTE AIRBNB'YE YAPIŞTIRACAĞIN LİNK BU
                totalEvents: events.length,
                bookings: events
            };
        })
    );

    // 3. ADIM: İki listeyi birleştirip ekrana bas
    res.json([...externalCalendars, ...localCalendars]);

  } catch (err) {
    console.error("Booking fetch error:", err);
    res.status(500).json({ error: "Takvim verileri alınamadı" });
  }
});
// --- DEBUG: TAKVİM VERİLERİNİ KONTROL ET ---
// Bu linke girince hafızadaki tüm Airbnb/Booking verilerini görürsün.


app.get("/api/debug-calendar", async (req, res) => {
  // 1. Önbellekteki (Cache) Dış Veriler
  const externalData = calendarCache.data;
  
  // 2. Veritabanındaki (Local) Veriler
  const [localBookings] = await pool.query("SELECT * FROM bookings WHERE status != 'rejected'");

  res.json({
    status: "success",
    lastUpdated: new Date(calendarCache.lastUpdated).toLocaleString('tr-TR'),
    isUpdating: calendarCache.isUpdating,
    summary: {
      externalSources: externalData.length,
      localBookings: localBookings.length
    },
    // Dış Kaynaklardan Gelen Dolu Günler
    externalCalendar: externalData, 
    // Senin Veritabanındaki Rezervasyonlar
    localDatabase: localBookings
  });
});

// --- YARDIMCI FONKSİYONLAR ---

// 1. ICS Linkinden Veri Çekme (Axios ile güncellendi)
async function fetchBookingCalendar(bookingUrl) {
  try {
    // fetch yerine axios kullanıyoruz
    const response = await axios.get(bookingUrl, {
      responseType: 'text' // ICS dosyası text formatındadır
    });
    
    // axios veriyi 'data' içinde döner, 'ok' kontrolüne gerek yok (hata olursa catch'e düşer)
    const icsData = response.data;
    const parsed = ical.parseICS(icsData);

    return Object.values(parsed)
      .filter((e) => e.type === "VEVENT")
      .map((e) => ({
        start: new Date(e.start),
        end: new Date(e.end),
        summary: e.summary || "Dolu",
      }));
  } catch (error) {
    // Hata mesajını daha temiz görelim
    console.error(`⚠️ ICS Hatası (${bookingUrl}):`, error.message);
    return []; 
  }
}

// 2. Cache Güncelleme 
async function updateCalendarCache() {
  if (calendarCache.isUpdating) return; 
  calendarCache.isUpdating = true;
  console.log("🔄 Takvim verileri güncelleniyor (Booking/Airbnb)...");

  try {
    const freshData = await Promise.all(
      CALENDAR_URLS.map(async (cal) => {
        const bookings = await fetchBookingCalendar(cal.url);
        return { roomName: cal.roomName, bookings };
      })
    );

    calendarCache.data = freshData;
    calendarCache.lastUpdated = Date.now();
    console.log("✅ Takvim verileri hafızaya alındı.");
  } catch (error) {
    console.error("❌ Cache güncelleme ana hatası:", error);
  } finally {
    calendarCache.isUpdating = false;
  }
}

// 3. İki tarih arasındaki günleri dizi olarak dönme
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

// 4. Token Doğrulama Middleware
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

// --- API ENDPOINTLERİ ---

// 1. ODA ARAMA (Cache Kullanır)
app.get("/api/rooms", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  try {
    const [rooms] = await pool.query("SELECT * FROM rooms");

    // Cache Kontrolü: Boşsa veya 15 dk geçtiyse güncelle
    const now = Date.now();
    if (calendarCache.data.length === 0 || (now - calendarCache.lastUpdated > 15 * 60 * 1000)) {
      await updateCalendarCache();
    }

    if (!checkIn || !checkOut) {
      return res.json(rooms);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Yerel DB Kontrolü
    const [localConflicts] = await pool.query(
      `SELECT room_id FROM bookings 
       WHERE status != 'rejected' 
       AND (check_in < ? AND check_out > ?)`,
      [checkOut, checkIn]
    );
    const localBlockedRoomIds = localConflicts.map((row) => row.room_id);

    // Filtreleme
    const availableRooms = rooms.filter((room) => {
      if (localBlockedRoomIds.includes(room.id)) return false;

      const matchingCalendars = calendarCache.data.filter((c) =>
        c.roomName.toLowerCase().includes(room.name.toLowerCase())
      );
      
      const externalBookings = matchingCalendars.flatMap((cal) => cal.bookings);

      const isExternalBooked = externalBookings.some((booking) => {
        const bStart = new Date(booking.start);
        const bEnd = new Date(booking.end);
        return checkInDate < bEnd && checkOutDate > bStart;
      });

      return !isExternalBooked;
    });

    res.json(availableRooms);

  } catch (err) {
    console.error("Rooms fetch error:", err);
    res.json([]); 
  }
});

// 2. MÜSAİTLİK GÜNLERİ (Cache Kullanır)
app.get("/api/room-availability/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [roomRows] = await pool.query("SELECT name FROM rooms WHERE id = ?", [id]);
    if (roomRows.length === 0) return res.status(404).json({ error: "Oda bulunamadı" });
    const roomName = roomRows[0].name;

    const now = Date.now();
    if (calendarCache.data.length === 0 || (now - calendarCache.lastUpdated > 15 * 60 * 1000)) {
       await updateCalendarCache();
    }

    let blockedDates = [];

    const matchingCalendars = calendarCache.data.filter((c) =>
      c.roomName.toLowerCase().includes(roomName.toLowerCase())
    );

    matchingCalendars.forEach(cal => {
       cal.bookings.forEach(event => {
          blockedDates.push(...getDatesInRange(event.start, event.end));
       });
    });

    const [localBookings] = await pool.query(
      "SELECT check_in, check_out FROM bookings WHERE room_id = ? AND status != 'rejected'",
      [id]
    );

    localBookings.forEach((b) => {
      blockedDates.push(...getDatesInRange(b.check_in, b.check_out));
    });

    const uniqueDates = [...new Set(blockedDates)];

    res.json(uniqueDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Müsaitlik alınamadı" });
  }
});

// 3. REZERVASYON YAPMA
app.post("/api/book-room", async (req, res) => {
  const { roomId, name, email, phone, checkIn, checkOut } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM bookings WHERE room_id = ? AND status != 'rejected' AND (check_in < ? AND check_out > ?)",
      [roomId, checkOut, checkIn]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Seçilen tarihler maalesef dolu." });
    }

    await pool.query(
      "INSERT INTO bookings (room_id, customer_name, customer_email, customer_phone, check_in, check_out, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
      [roomId, name, email, phone, checkIn, checkOut]
    );

    res.json({ success: true, message: "Rezervasyon talebiniz alındı." });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Rezervasyon oluşturulamadı: " + err.message });
  }
});

// 4. ICS EXPORT
app.get("/api/export-ical/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE room_id = ? AND status != 'rejected'",
      [roomId]
    );

    const roomData = await pool.query("SELECT name FROM rooms WHERE id = ?", [roomId]);
    const roomname = roomData[0].length > 0 ? roomData[0][0].name : "Room";

    const calendar = icalGenerator({
      name: roomname,
      timezone: "Europe/Istanbul",
    });

    bookings.forEach((b) => {
      const createdTime = new Date(b.created_at).getTime();
      const now = new Date().getTime();
      const fiveDaysMs = 5 * 24 * 60 * 60 * 1000;
      const isExpiredPending = (b.status === 'pending') && ((now - createdTime) > fiveDaysMs);

      if (!isExpiredPending) {
        calendar.createEvent({
          start: b.check_in,
          end: b.check_out,
          summary: b.status === "pending" ? "DOLU (Opsiyon)" : "DOLU",
          description: `Durum: ${b.status}`,
          uid: `booking-${b.id}@seninsiten.com`,
        });
      }
    });

    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"'
    });
    res.end(calendar.toString());

  } catch (err) {
    console.error("Export ICS error:", err);
    res.status(500).send("ICS Hatası");
  }
});

// 5. ADMIN GİRİŞ
app.post("/api/admin", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM admin WHERE username = ? AND password = ?",
      [username, password]
    );
    if (rows.length === 0) return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 6. ADMIN REZERVASYONLAR
app.get("/api/admin/bookings", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, r.name as room_name 
      FROM bookings b 
      JOIN rooms r ON b.room_id = r.id 
      ORDER BY b.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Veriler çekilemedi" });
  }
});

// 7. ADMIN DURUM GÜNCELLEME
app.put("/api/admin/bookings/:id", authenticateToken, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

// 8. ODA GÜNCELLEME
app.put("/api/rooms/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { price, description } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE rooms SET price = COALESCE(?, price), description = COALESCE(?, description) WHERE id = ?",
      [price ?? null, description ?? null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Oda bulunamadı" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Güncelleme başarısız" });
  }
});

// 9. ODA GÖRSELLERİ
app.get("/api/room_images/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT image_path FROM room_images WHERE room_id = ?", [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Görseller yüklenemedi" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
  updateCalendarCache(); 
});