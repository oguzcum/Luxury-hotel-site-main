import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { RoomContext } from "../context/RoomContext";
import ScrollToTop from "../components/ScrollToTop";
import { FaCheck } from "react-icons/fa";

// YENİ EKLEDİĞİMİZ BİLEŞENİ İMPORT ET
import SingleRoomReservation from "../components/SingleRoomReservation"; 

const RoomDetails = () => {
  const { rooms } = useContext(RoomContext);
  const { id } = useParams();
  const [images, setImages] = useState([]);

  // Görselleri çek
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/room_images/${id}`);
        setImages(res.data);
      } catch (err) {
        console.error("Resim yükleme hatası:", err);
      }
    };
    fetchImages();
  }, [id]);

  if (!rooms || rooms.length === 0) {
    return <h2 className="text-center mt-20">Oda bilgileri yükleniyor...</h2>;
  }

  const room = rooms.find((room) => room.id === Number(id));
  if (!room) {
    return <h2 className="text-center mt-20">Oda bulunamadı</h2>;
  }

  const { name, image, description, facilities = [] } = room;

  // Airbnb link mantığını dilersen tutabilirsin, ama artık kendi sistemin var.
  // Aşağıdaki return kısmında form ile birlikte nasıl duracağını ayarladım.

  return (
    <section>
      <ScrollToTop />
      {/* Kapak */}
      <div className="bg-cover bg-center h-[560px] relative flex justify-center items-center">
        <img className="absolute w-full h-full object-cover" src={image} alt={name} />
        <div className="absolute w-full h-full bg-black/70"></div>
        <h1 className="text-6xl text-white z-20 font-primary text-center">
          {name} Detayları
        </h1>
      </div>

      <div className="container mx-auto py-24 flex flex-col lg:flex-row gap-10">
        {/* SOL TARAFLAR: Galeri ve Açıklamalar */}
        <div className="w-full lg:w-[60%]">
          <h2 className="h2 mb-4">{name}</h2>
          <p className="mb-8">{description}</p>
          
          {/* Fotoğraf Galerisi */}
          {images.length > 0 && (
            <div className="mb-12">
              <h3 className="h3 mb-3">Fotoğraf Galerisi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img) => (
                  <img
                    key={img.image_path}
                    src={img.image_path}
                    alt={`${name} resmi`}
                    className="w-full h-48 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

           {/* Oda Özellikleri (Alt tarafta geniş kalsın) */}
           <div>
            <h3 className="h3 mb-4">Oda Özellikleri</h3>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {facilities.map((item, index) => {
                const { name, icon } = item;
                return (
                  <div className="flex items-center gap-x-3" key={index}>
                    <div className="text-2xl text-accent">{icon}</div>
                    <div className="text-base">{name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SAĞ TARAFLAR: Rezervasyon Formu ve Kurallar */}
        <div className="w-full lg:w-[40%]">
          
          {/* 1. YENİ REZERVASYON FORMU BURAYA GELİYOR */}
          <div className="mb-8">
            <SingleRoomReservation roomId={id} />
          </div>

          {/* 2. Otel Kuralları */}
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="h3 mb-4">Otel Kuralları</h3>
            <ul className="flex flex-col gap-y-3">
              <li className="flex items-center gap-x-3">
                <FaCheck className="text-accent" /> Check-in: 3:00 PM - 9:00 PM
              </li>
              <li className="flex items-center gap-x-3">
                <FaCheck className="text-accent" /> Check-out: 10:30 AM
              </li>
              <li className="flex items-center gap-x-3">
                <FaCheck className="text-accent" /> Evcil hayvan kabul edilmez
              </li>
              <li className="flex items-center gap-x-3">
                <FaCheck className="text-accent" /> Sigara içilmez
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default RoomDetails;