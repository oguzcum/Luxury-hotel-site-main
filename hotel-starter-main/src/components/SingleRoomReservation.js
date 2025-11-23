import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from "date-fns/locale/tr"; // Türkçe takvim
import axios from "axios";
import { BsCalendar } from "react-icons/bs";

registerLocale("tr", tr);

const SingleRoomReservation = ({ roomId }) => {
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form Verileri
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // 1. Backend'den Dolu Günleri Çek
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/room-availability/${roomId}`);
        const dates = res.data.map((dateStr) => {
             // Saat farkı sorununu önlemek için string'i düzgün parse et
             return new Date(dateStr); 
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
    // Kullanıcı giriş ve çıkış seçti ama arada dolu bir gün kalmış olabilir.
    const isRangeBlocked = blockedDates.some(date => 
        date > checkInDate && date < checkOutDate
    );

    if (isRangeBlocked) {
        alert("Seçtiğiniz tarih aralığında odamız maalesef dolu. Lütfen başka tarih seçiniz.");
        return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/book-room", {
        roomId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });

      if (res.data.success) {
        alert("Rezervasyon talebiniz alındı! Sizi arayarak onaylayacağız.");
        // Formu temizle
        setCheckInDate(null);
        setCheckOutDate(null);
        setFormData({ name: "", email: "", phone: "" });
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
                excludeDates={blockedDates} // Dolu günleri engelle
                dateFormat="dd/MM/yyyy"
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
                excludeDates={blockedDates} // Dolu günleri engelle
                dateFormat="dd/MM/yyyy"
                disabled={!checkInDate}
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