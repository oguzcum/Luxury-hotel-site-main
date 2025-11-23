const ical = require("ical");
const icalGenerator = require("ical-generator").default; // ICS oluşturmak için
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

// --- SABİT VERİLER ---
// ICS Linklerini buraya taşıdık, hem /rooms hem /room-availability kullanabilsin diye.
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
  { roomName: "Artist Antik Oda 1", url: "https://www.airbnb.com.tr/calendar/ical/1216412435355275374.ics?s=d7e7aa56a3493672a44eb7b35eec01e7 "},
  { roomName: "Artist Antik Oda 2", url: "https://www.airbnb.com.tr/calendar/ical/1204985904090852447.ics?s=6157e2eb75882ede7f9ca08521674d02" },
  { roomName: "Artist Antik Oda 3", url: "https://www.airbnb.com.tr/calendar/ical/1204985752944850711.ics?s=d09aa5c00b432e1a419a4da9c729cc8d" },
  { roomName: "Artist Antik Oda 1", url: "https://ical.booking.com/v1/export?t=318b7ab7-416e-44da-964b-dc10621976ff" }
];

// --- YARDIMCI FONKSİYONLAR ---

// Middleware: Token kontrolü
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

// Dış ICS linkinden veri çekme
async function fetchBookingCalendar(bookingUrl) {
  try {
    const response = await fetch(bookingUrl);
    if (!response.ok) throw new Error("ICS fetch failed");
    const icsData = await response.text();
    const parsed = ical.parseICS(icsData);

    return Object.values(parsed)
      .filter((e) => e.type === "VEVENT")
      .map((e) => ({
        start: new Date(e.start),
        end: new Date(e.end),
        summary: e.summary || "Dolu",
      }));
  } catch (error) {
    console.error(`Error fetching ICS from ${bookingUrl}:`, error);
    return []; // Hata durumunda boş dön ki sistem çökmesin
  }
}

// İki tarih arasındaki günleri dizi olarak döner (DatePicker engellemek için)
function getDatesInRange(startDate, endDate) {
  const date = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  // Sadece gün kısmını karşılaştırmak için saatleri sıfırla (opsiyonel ama güvenli)
  date.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (date < end) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}


// --- API ENDPOINTLERİ ---
// DEBUG
// DEBUG: Hem Dış (Airbnb/Booking) Hem İç (Yerel) Takvim Verilerini Gör
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

    // 2. ADIM: İç Kaynaklardan (Senin Veritabanın) Oluşturulan Veriler
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
            const exportUrl = `http://localhost:4000/api/export-ical/${room.id}`;

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

// 1. ODA ARAMA VE FİLTRELEME (Ana Sayfa)
app.get("/api/rooms", async (req, res) => {
  const { checkIn, checkOut } = req.query;

  try {
    const [rooms] = await pool.query("SELECT * FROM rooms");

    // ICS verilerini çek
    const calendarData = await Promise.all(
      CALENDAR_URLS.map(async (cal) => {
        const bookings = await fetchBookingCalendar(cal.url);
        return { roomName: cal.roomName, bookings };
      })
    );

    // Kendi DB'mizdeki 'confirmed' ve 'pending' rezervasyonları da çekip birleştirmek gerekir
    // Ancak performans için basit aramada şimdilik sadece dış ICS + basit tarih kontrolü yapıyoruz.
    // Detaylı kontrolü frontend'deki "Müsaitlik Kontrolü" butonuna bırakabilirsin.

    if (!checkIn || !checkOut) {
      return res.json(rooms);
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const availableRooms = rooms.filter((room) => {
      // Dış kaynaklar (Airbnb, Booking)
      const matchingCalendars = calendarData.filter((c) =>
        c.roomName.toLowerCase().includes(room.name.toLowerCase())
      );
      const externalBookings = matchingCalendars.flatMap((cal) => cal.bookings);

      // Çakışma Kontrolü
      const isExternalBooked = externalBookings.some((booking) => {
        return checkInDate < booking.end && checkOutDate > booking.start;
      });

      return !isExternalBooked;
    });

    res.json(availableRooms);
  } catch (err) {
    console.error("Rooms fetch error:", err);
    res.status(500).json({ message: "Oda bilgileri alınamadı" });
  }
});


// 2. TEK ODA İÇİN MÜSAİTLİK GÜNLERİ (Oda Detay - DatePicker için)
// Bu endpoint, seçili odanın hem Booking/Airbnb hem de senin DB'ndeki dolu günlerini birleştirir.
app.get("/api/room-availability/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Oda ismini bul
    const [roomRows] = await pool.query("SELECT name FROM rooms WHERE id = ?", [id]);
    if (roomRows.length === 0) return res.status(404).json({ error: "Oda bulunamadı" });
    const roomName = roomRows[0].name;

    let blockedDates = [];

    // A) Dış ICS Verileri (Booking & Airbnb)
    const matchingCalendars = CALENDAR_URLS.filter((c) =>
      c.roomName.toLowerCase().includes(roomName.toLowerCase())
    );

    await Promise.all(
      matchingCalendars.map(async (cal) => {
        const events = await fetchBookingCalendar(cal.url);
        events.forEach((event) => {
          blockedDates.push(...getDatesInRange(event.start, event.end));
        });
      })
    );

    // B) Yerel DB Verileri (Senin Siten)
    const [localBookings] = await pool.query(
      "SELECT check_in, check_out FROM bookings WHERE room_id = ? AND status != 'rejected'",
      [id]
    );

    localBookings.forEach((b) => {
      blockedDates.push(...getDatesInRange(b.check_in, b.check_out));
    });

    // Tekrar eden tarihleri temizle ve string formatında gönder (Frontend parse edecek)
    const uniqueDates = [
      ...new Set(blockedDates.map((d) => d.toISOString().split("T")[0])),
    ];

    res.json(uniqueDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Müsaitlik alınamadı" });
  }
});


// 3. REZERVASYON YAPMA (Müşteri Formu)
function fixDateForMySQL(isoDateString) {
  const date = new Date(isoDateString);
  // Türkiye saati için manuel düzeltme (Eğer sunucun UTC çalışıyorsa günü korumak için)
  date.setHours(date.getHours() + 3); 
  return date.toISOString().split('T')[0];
}

// 3. REZERVASYON YAPMA (Müşteri Formu)
app.post("/api/book-room", async (req, res) => {
  const { roomId, name, email, phone, checkIn, checkOut } = req.body;

  try {
    // Tarihleri MySQL formatına çevir
    const sqlCheckIn = fixDateForMySQL(checkIn);
    const sqlCheckOut = fixDateForMySQL(checkOut);

    // Basit bir çakışma kontrolü (DB seviyesinde)
    const [existing] = await pool.query(
      "SELECT * FROM bookings WHERE room_id = ? AND status != 'rejected' AND (check_in < ? AND check_out > ?)",
      [roomId, sqlCheckOut, sqlCheckIn]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Seçilen tarihler maalesef dolu." });
    }

    // Rezervasyonu 'pending' olarak kaydet
    await pool.query(
      "INSERT INTO bookings (room_id, customer_name, customer_email, customer_phone, check_in, check_out, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
      [roomId, name, email, phone, sqlCheckIn, sqlCheckOut]
    );

    res.json({ success: true, message: "Rezervasyon talebiniz alındı." });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Rezervasyon oluşturulamadı: " + err.message });
  }
});


// 4. KENDİ ICS DOSYANI OLUŞTUR (Booking/Airbnb'ye verilecek link)
// Örn: http://localhost:4000/api/export-ical/1
// 4. KENDİ ICS DOSYANI OLUŞTUR (Booking/Airbnb'ye verilecek link)
// Örn: http://localhost:4000/api/export-ical/1
app.get("/api/export-ical/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE room_id = ? AND status != 'rejected'",
      [roomId]
    );

    // Takvim objesini oluştur
    const calendar = icalGenerator({
      name: `Pink Home Oda ${roomId}`,
      timezone: "Europe/Istanbul",
    });

    bookings.forEach((b) => {
      // Pending süresi kontrolü (5 gün kuralı)
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
          uid: `booking-${b.id}@seninsiten.com`, // Unique ID
        });
      }
    });

    // --- DÜZELTME BAŞLANGICI ---
    // calendar.serve(res) YERİNE AŞAĞIDAKİ YÖNTEMİ KULLANIYORUZ:
    
    // 1. Tarayıcıya veya Airbnb'ye bunun bir takvim dosyası olduğunu söyle
    res.writeHead(200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="calendar.ics"'
    });

    // 2. Dosya içeriğini string'e çevirip gönder
    res.end(calendar.toString());
    // --- DÜZELTME BİTİŞİ ---

  } catch (err) {
    console.error("Export ICS error:", err);
    res.status(500).send("ICS Hatası");
  }
});


// 5. ADMIN: LOGİN
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
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 6. ADMIN: REZERVASYONLARI LİSTELE
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

// 7. ADMIN: REZERVASYON ONAY/RET
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

// 8. ADMIN: ODA BİLGİLERİNİ GÜNCELLE
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

// SUNUCUYU BAŞLAT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));