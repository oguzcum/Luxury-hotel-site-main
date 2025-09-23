import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { RoomContext } from "../context/RoomContext";
import ScrollToTop from "../components/ScrollToTop";
import { FaCheck } from "react-icons/fa";

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

  return (
    <section>
      <ScrollToTop />
      {/* Kapak */}
      <div className="bg-cover bg-center h-[560px] relative flex justify-center items-center">
    {/* Resim */}
    <img
      className="absolute w-full h-full object-cover"
      src={image}
      alt={name}
    />
    {/* Overlay - bu div resmin üzerinde siyah transparan katman olacak */}
    <div className="absolute w-full h-full bg-black/70"></div>
    {/* Başlık */}
    <h1 className="text-6xl text-white z-20 font-primary text-center">
      {name} Detayları
    </h1>
  </div>
      

      <div className="container mx-auto py-24 flex flex-col lg:flex-row">
        {/* Sol - Fotoğraf Galerisi ve Açıklama */}
        <div className="w-full lg:w-[60%] px-6">
          <h2 className="h2">{name}</h2>
          

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
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ - Otel Kuralları ve Oda Özellikleri */}
        <div className="w-full lg:w-[40%] px-6">
          {/* Otel Kuralları */}
          <div className="mb-12">
            <h3 className="h3">Otel Kuralları</h3>
            <ul className="mt-6 flex flex-col gap-y-3">
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

          {/* Oda Özellikleri */}
          <div>
            <h3 className="h3 mb-3">Oda Özellikleri</h3>
            <p className="mb-6">
              {description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    </section>
  );
};

export default RoomDetails;