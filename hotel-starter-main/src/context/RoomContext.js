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
    try {
      const checkInStr = checkInDate.toISOString().split("T")[0];
      const checkOutStr = checkOutDate.toISOString().split("T")[0];

      const res = await axios.get("http://localhost:4000/api/rooms", {
        params: { checkIn: checkInStr, checkOut: checkOutStr },
      });

      // Backend'den dönen odaları kaydet (ancak roomType filtresi korunacak)
      const availableRooms = res.data;
      setAllRooms(availableRooms); // Tüm odaları güncelle
    } catch (err) {
      console.error("Tarih aralığına göre odalar alınamadı:", err);
    } finally {
      setLoading(false);
    }
  }, [checkInDate, checkOutDate]);

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
