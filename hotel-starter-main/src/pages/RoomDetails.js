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
  var link = "";
  if (id == 4) {
    link = "https://www.airbnb.com/rooms/1161664008389716366?source_impression_id=p3_1762508530_P3i0Ajd_3M727EyP";
  } else if (id == 5) {
    link = "https://www.airbnb.com/rooms/1161670080306403232?source_impression_id=p3_1762508530_P36YXsH608zlFDzL";
  } else if (id == 6) {
    link = "https://www.airbnb.com/rooms/1200111756457610405?source_impression_id=p3_1762508530_P33WLjs8b6Jdx4XJ";
  } else if (id == 7) {
    link = "https://www.airbnb.com/rooms/1428891192444829885?source_impression_id=p3_1762509591_P30aGXbBau5BdFvn";
  }else if (id == 8) {
    link = "https://www.airbnb.com/rooms/1428939196073293602?source_impression_id=p3_1762508530_P3xE2Kni2nwxKD6X";
  } else {
    link = "#";
  }
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
            <button className="btn btn-primary mt-6"><a href={link}>AIRBNB ÜZERINDEN REZERVASYON YAP</a></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetails;