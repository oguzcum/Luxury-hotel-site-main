import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr"; // Türkçe dil desteği
import axios from "axios";
import { BsCalendar } from "react-icons/bs";

registerLocale("tr", tr);

const SingleRoomReservation = ({ roomId }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // --- YARDIMCI FONKSİYON ---
  // Date objesini yerel saati bozmadan "YYYY-MM-DD" stringine çevirir.
  // new Date().toISOString() kullanırsak UTC'ye çevirip günü geri atabilir, bu yüzden bunu kullanıyoruz.
  const formatDateToString = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. Backend'den Dolu Günleri Çek ve Düzgün Parse Et
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/room-availability/${roomId}`);
        
        // Backend'den ["2025-12-03", "2025-12-04"] gibi string listesi geliyor.
        // Bunu doğrudan new Date() içine atarsak tarayıcı UTC sanıp günü geri kaydırabilir.
        // Bu yüzden string'i manuel parçalayıp (split) oluşturuyoruz.
        const dates = res.data.map((dateStr) => {
             const [year, month, day] = dateStr.split("-").map(Number);
             // Javascript'te aylar 0-11 arasıdır, o yüzden month - 1
             return new Date(year, month - 1, day);
        });

        setBlockedDates(dates);
      } catch (err) {
        console.error("Takvim verisi alınamadı", err);
      }
    };

    if (roomId) fetchBlockedDates();
  }, [roomId]);

  // Input Değişikliklerini Yakala
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Rezervasyon Gönder
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasyon 1: Boş Alan Kontrolü
    if (!checkInDate || !checkOutDate || !formData.name || !formData.email || !formData.phone) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    // Validasyon 2: Tarih Aralığında Dolu Gün Var mı?
    const isRangeBlocked = blockedDates.some(date => 
        date > checkInDate && date < checkOutDate
    );

    if (isRangeBlocked) {
        alert("Seçtiğiniz tarih aralığında odamız maalesef dolu. Lütfen başka tarih seçiniz.");
        return;
    }

    setLoading(true);

    try {
      // Backend'e Date objesi değil, formatlanmış STRING gönderiyoruz.
      // Bu sayede "3 Aralık seçtim, sunucuya 2 Aralık gitti" sorunu çözülür.
      const formattedCheckIn = formatDateToString(checkInDate);
      const formattedCheckOut = formatDateToString(checkOutDate);

      const res = await axios.post("http://localhost:4000/api/book-room", {
        roomId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkIn: formattedCheckIn,   // Örn: "2025-12-03"
        checkOut: formattedCheckOut, // Örn: "2025-12-11"
      });

      if (res.data.success) {
        alert("Rezervasyon talebiniz alındı! Sizi arayarak onaylayacağız.");
        
        // Formu sıfırla
        setCheckInDate(null);
        setCheckOutDate(null);
        setFormData({ name: "", email: "", phone: "" });
        
        // Sayfayı yenile ki takvim güncellensin
        window.location.reload();
      }
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || "Bir sorun oluştu."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-accent/20">
      <h3 className="h3 text-center mb-6">Rezervasyon Talep Et</h3>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
        {/* --- TAKVİM KISMI --- */}
        <div className="flex flex-col gap-y-2">
            <label className="text-sm font-semibold">Giriş Tarihi</label>
            <div className="relative flex items-center h-[50px] border border-gray-300 rounded-md px-2 bg-gray-50">
            <div className="absolute z-10 left-3 text-accent">
                <BsCalendar />
            </div>
            <DatePicker
                className="w-full h-full pl-8 bg-transparent outline-none cursor-pointer text-gray-700"
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                placeholderText="Tarih Seçiniz"
                locale="tr"
                minDate={new Date()}
                excludeDates={blockedDates}
                dateFormat="dd/MM/yyyy"
                calendarClassName="notranslate"
            />
            </div>
        </div>

        <div className="flex flex-col gap-y-2">
            <label className="text-sm font-semibold">Çıkış Tarihi</label>
            <div className="relative flex items-center h-[50px] border border-gray-300 rounded-md px-2 bg-gray-50">
            <div className="absolute z-10 left-3 text-accent">
                <BsCalendar />
            </div>
            <DatePicker
                className="w-full h-full pl-8 bg-transparent outline-none cursor-pointer text-gray-700"
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                placeholderText="Tarih Seçiniz"
                locale="tr"
                minDate={checkInDate || new Date()}
                excludeDates={blockedDates}
                dateFormat="dd/MM/yyyy"
                disabled={!checkInDate}
                calendarClassName="notranslate"
            />
            </div>
        </div>

        {/* --- KİŞİSEL BİLGİLER --- */}
        <div className="flex flex-col gap-y-2 mt-2">
            <input 
                type="text" 
                name="name"
                placeholder="Ad Soyad" 
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 h-[50px] px-4 rounded-md outline-none focus:border-accent transition"
                required
            />
            <input 
                type="text" 
                name="phone"
                placeholder="Telefon (5XX...)" 
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 h-[50px] px-4 rounded-md outline-none focus:border-accent transition"
                required
            />
            <input 
                type="email" 
                name="email"
                placeholder="E-posta Adresi" 
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 h-[50px] px-4 rounded-md outline-none focus:border-accent transition"
                required
            />
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="btn btn-secondary w-full py-4 mt-2 shadow-md hover:shadow-lg transition-all"
        >
            {loading ? "Gönderiliyor..." : "REZERVASYON YAP"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
            *Talebiniz onaylandığında size dönüş yapılacaktır.
        </p>
      </form>
    </div>
  );
};

export default SingleRoomReservation;