import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [adults, setAdults] = useState("1 Yetişkin");
  const [kids, setKids] = useState("0 Çocuk");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("Tümü"); // Varsayılan değer "Tümü"

  // Sayfa ilk açıldığında odaları backend'den çek
  useEffect(() => {
    axios.get("http://localhost:4000/api/rooms").then((res) => {
      setRooms(res.data);
      setAllRooms(res.data);
    });
  }, []);

  // Kişi sayısı hesaplama
  useEffect(() => {
    const adultCount = parseInt(adults) || 0;
    const kidCount = parseInt(kids) || 0;
    setTotal(adultCount + kidCount);
  }, [adults, kids]);

  // Oda türüne göre filtreleme 
  useEffect(() => {
    if (!allRooms.length) return;
    
    let filteredRooms = allRooms;
    
    if (roomType === "Artist Antik") {
      filteredRooms = allRooms.filter((room) => room.name.includes("Artist Antik"));
    } else if (roomType === "Pink Home") {
      filteredRooms = allRooms.filter((room) => room.name.includes("Pink Home"));
    }
    // "Tümü" seçeneği için else gerek yok, zaten filteredRooms = allRooms
    
    setRooms(filteredRooms);
  }, [roomType, allRooms]);

  // Filtreleme butonu 
  const handleClick = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Önce oda türüne göre filtrele
    let filteredRooms = allRooms;
    if (roomType === "Artist Antik") {
      filteredRooms = allRooms.filter((room) => room.name.includes("Artist Antik"));
    } else if (roomType === "Pink Home") {
      filteredRooms = allRooms.filter((room) => room.name.includes("Pink Home"));
    }
    
    // Sonra kişi sayısına göre filtrele
    const newRooms = filteredRooms.filter((room) => total <= Number(room.maxPerson));
    
    setTimeout(() => {
      setRooms(newRooms);
      setLoading(false);
    }, 3000);
  };

  // Yeni eklenen reset fonksiyonu
  const resetFilters = () => {
    setAdults("1 Yetişkin");
    setKids("0 Çocuk");
    setRoomType("Tümü"); // Tüm odaları göster
    setRooms(allRooms); // Tüm odaları tekrar yükle
  };

  return (
    <RoomContext.Provider
      value={{ 
        rooms, 
        adults, 
        setAdults, 
        kids, 
        setKids, 
        handleClick, 
        loading,
        resetFilters,
        allRooms,
        roomType,
        setRoomType,
        total // total'i de ekledik
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;