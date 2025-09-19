import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa"; // WhatsApp ikonu için react-icons kullanıyoruz

const WhatsAppChat = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const phone = "905398842502"; // Türkiye +90 kodlu numara

  return (
    <>
      {open && (
        <div style={{
          position: "fixed",
          bottom: "90px",
          right: "20px",
          width: "300px",
          height: "400px",
          backgroundColor: "#ECE5DD",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif"
        }}>
          {/* Başlık */}
          <div style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            backgroundColor: "#25D366",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            <FaWhatsapp size={20} style={{ marginRight: "8px" }} />
            Hamza Peker - Satış Danışmanı 
          </div>

          {/* Mesaj alanı */}
          <div style={{
            flex: 1,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            gap: "5px"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "8px",
              borderRadius: "10px",
              alignSelf: "flex-start",
              maxWidth: "80%",
              wordWrap: "break-word",
              fontSize: "14px",
              color: "#000"
            }}>
              {message || "Merhaba Sizlere Nasıl Yardımcı Olabiliriz?"}
            </div>
          </div>

          {/* Mesaj yazma ve gönderme */}
          <div style={{ display: "flex", borderTop: "1px solid #ccc" }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesaj yazın..."
              style={{
                flex: 1,
                padding: "10px",
                border: "none",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "#f0f0f0"
              }}
            />
            <button
              onClick={() => {
                if (message.trim() !== "") {
                  window.open(
                    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
                    "_blank"
                  );
                  setMessage("");
                }
              }}
              style={{
                backgroundColor: "#25D366",
                color: "#fff",
                border: "none",
                padding: "10px",
                cursor: "pointer"
              }}
            >
              Gönder
            </button>
          </div>
        </div>
      )}

      {/* Chat butonu */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          width: "60px",
          height: "60px",
          bottom: "30px",
          right: "30px",
          backgroundColor: "#25D366",
          color: "#fff",
          borderRadius: "50%",
          border: "none",
          fontSize: "30px",
          boxShadow: "2px 2px 5px #999",
          zIndex: 1000,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FaWhatsapp size={40}/>
      </button>
    </>
  );
};

export default WhatsAppChat;
