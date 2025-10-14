import React from "react";
import ScrollToTop from "../components/ScrollToTop";

const AboutUs = () => {
  return (
    <section className="py-16 bg-gray-50 min-h-screen ">
      <ScrollToTop />
      <div className="container mx-auto px-4 max-w-5xl space-y-16 bg-pink-100 p-10 rounded-lg shadow-lg">
        
        {/* Hakkımızda */}
        <div className="grid md:grid-cols-2 gap-10 items-center ">
          <img
            src="/balatodalar/Pinkom 1/pinkom10.jpg"
            alt="Luxury Hotel"
            className="rounded-xl shadow-lg w-full object-cover h-80 hover:scale-105 transition-transform duration-500"
          />
          <div>
            <h3 className="text-3xl font-bold text-[#d1935a] mb-6">
              Hakkımızda
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Pink Home Balat, İstanbul’un tarihi ve kültürel zenginlikleriyle dolu
              Balat semtinde yer alan benzersiz bir konaklama deneyimi sunar.
              Tarihi dokusunu koruyan konaklamamız, misafirlerine hem modern konforu
              hem de nostaljik atmosferi bir arada yaşama fırsatı tanır.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Samimiyetle karşılandığınız otelimizde, sadece bir konaklama
              değil; sıcak anılar biriktireceğiniz özel bir deneyim sizi bekliyor.
            </p>
          </div>
        </div>

        {/* Balat Bölümü */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl font-bold text-[#d1935a] mb-6">
              Balat’ı Keşfedin
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Balat; renkli evleri, dar sokakları, kafeleri ve tarihi
              yapılarıyla İstanbul’un en özgün semtlerinden biridir. Osmanlı ve
              Bizans izlerini taşıyan bu semtte yürüyüş yapmak, adeta zamanda
              yolculuğa çıkmak gibidir.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Misafirlerimiz, otelimizin bulunduğu bu eşsiz bölgede; sahil
              boyunca yürüyebilir, tarihi kiliseleri ziyaret edebilir ve
              sokaklardaki sanat galerilerini keşfedebilirler.
            </p>
          </div>
          <img
            src="balatodalar/Artist Antik 3/aortak10.jpg"
            alt="Balat Streets"
            className="rounded-xl shadow-lg w-full object-cover h-80 hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Harita */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#d1935a] mb-6">
            Bizi Nerede Bulabilirsiniz?
          </h3>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              title="Balat Otel Konum"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6018.796470248209!2d28.9496597!3d41.0329824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caba46506e8d0f%3A0x622aeb5a8c746d!2sBalat%2C%20Akg%C3%BCl%20Sk.%20No%3A7%2C%2034087%20Fatih%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1693233115345!5m2!1str!2str"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
