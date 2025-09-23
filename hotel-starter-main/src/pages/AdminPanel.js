import React, { useEffect, useState } from "react";
import axios from "axios";
import LoginBox from "../components/LoginBox";

const AdminPanel = () => {
  const [rooms, setRooms] = useState([]);
  const [priceEdit, setPriceEdit] = useState({});
  const [descEdit, setDescEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(!localStorage.getItem("token"));

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Odalar yüklenirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const updatePrice = async (id) => {
    try {
      const newPrice = parseFloat(priceEdit[id]);
      await axios.put(
        `http://localhost:4000/api/rooms/${id}`,
        { price: newPrice },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRooms(rooms.map(r => r.id === id ? { ...r, price: newPrice } : r));
      alert("Fiyat başarıyla güncellendi!");
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || err.message));
    }
  };

  const updateDescription = async (id) => {
    try {
      const newDesc = descEdit[id];
      await axios.put(
        `http://localhost:4000/api/rooms/${id}`,
        { description: newDesc },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRooms(rooms.map(r => r.id === id ? { ...r, description: newDesc } : r));
      alert("Açıklama başarıyla güncellendi!");
    } catch (err) {
      alert("Hata: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Paneli</h1>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Oda Yönetimi</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">Yükleniyor...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {rooms.map(room => (
                <div key={room.id} className="p-6 grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{room.name}</h3>
                    <p className="text-gray-600">
                      Mevcut fiyat: <b>{room.price}₺</b>
                    </p>
                    <p className="text-gray-600 mt-1">
                      Açıklama: {room.description || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Yeni Fiyat</label>
                    <input
                      type="number"
                      defaultValue={room.price}
                      onChange={e =>
                        setPriceEdit({ ...priceEdit, [room.id]: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      onClick={() => updatePrice(room.id)}
                      disabled={!priceEdit[room.id]}
                      className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                      Fiyat Güncelle
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Yeni Açıklama</label>
                    <textarea
                      type="textarea"
                      defaultValue={room.description}
                      onChange={e =>
                        setDescEdit({ ...descEdit, [room.id]: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <button
                      onClick={() => updateDescription(room.id)}
                      disabled={!descEdit[room.id]}
                      className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
                    >
                      Açıklama Güncelle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <LoginBox onClose={() => setShowLogin(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
