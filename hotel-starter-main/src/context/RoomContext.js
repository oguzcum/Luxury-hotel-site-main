import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("Tümü");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [originalRooms, setOriginalRooms] = useState([]);


useEffect(() => {
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/rooms");
      setRooms(res.data);
      setAllRooms(res.data);
      setOriginalRooms(res.data); 
    } catch (err) {
      console.error("Odalar alınırken hata oluştu:", err);
    }
  };
  fetchRooms();
}, []);

  // 🧭 Oda tipine göre filtreleme (her zaman allRooms veya son sorgulanan odalar üzerinden)
  useEffect(() => {
    if (!allRooms.length) return;

    if (roomType === "Tümü") {
      setRooms(allRooms);
      return;
    }

    const filtered = allRooms.filter((room) =>
      room.name?.toLowerCase().includes(roomType.toLowerCase())
    );
    setRooms(filtered);
  }, [allRooms, roomType]);

  // 🔍 Tarihe göre backend'den uygun odaları çek
const filterByDateRange = useCallback(async () => {
    if (!checkInDate || !checkOutDate) return;

    setLoading(true);
    // Arama başladığında odaları geçici olarak boşalt ki kullanıcı eski listeyi görmesin
    // Bu isteğe bağlıdır, loading spinner zaten dönüyor ama garanti olur.
    // setAllRooms([]); 

    try {
      // Tarihleri yerel saat dilimine dikkat ederek gönder (Opsiyonel düzeltme)
      // .split('T')[0] bazen saat farkından bir gün geriyi alabilir.
      // Aşağıdaki yöntem daha güvenlidir:
      const checkInStr = new Date(checkInDate.getTime() - (checkInDate.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
      const checkOutStr = new Date(checkOutDate.getTime() - (checkOutDate.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

      const res = await axios.get("http://localhost:4000/api/rooms", {
        params: { checkIn: checkInStr, checkOut: checkOutStr },
      });

      const availableRooms = res.data;
      setAllRooms(availableRooms);
      
      // Eğer roomType seçiliyse filtreyi tekrar uygula
      if (roomType !== "Tümü") {
         const filtered = availableRooms.filter((room) =>
            room.name?.toLowerCase().includes(roomType.toLowerCase())
         );
         setRooms(filtered);
      } else {
         setRooms(availableRooms);
      }

    } catch (err) {
      console.error("Tarih aralığına göre odalar alınamadı:", err);
      // HATA OLURSA ODALARI BOŞALT (Kullanıcı "hepsi dolu" sansın, "hepsi boş" sanmasın!)
      setAllRooms([]);
      setRooms([]); 
      alert("Bağlantı hatası oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setLoading(false);
    }
  }, [checkInDate, checkOutDate, roomType]);

  // Kullanıcı tarih seçtikçe filtreleme tetikle
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      filterByDateRange();
    }
  }, [checkInDate, checkOutDate, filterByDateRange]);

  // 🔄 Reset fonksiyonu
 const resetFilters = useCallback(() => {
  setRoomType("Tümü");
  setCheckInDate(null);
  setCheckOutDate(null);
  setRooms(originalRooms);   
  setAllRooms(originalRooms);
}, [originalRooms]);


  return (
    <RoomContext.Provider
      value={{
        rooms,
        allRooms,
        roomType,
        setRoomType,
        loading,
        resetFilters,
        checkInDate,
        setCheckInDate,
        checkOutDate,
        setCheckOutDate,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;
