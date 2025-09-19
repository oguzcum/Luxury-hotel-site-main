import React, { useEffect, useState } from "react";
import axios from "axios";

import LoginBox from "../components/LoginBox";

const AdminPanel = () => {
    const [rooms, setRooms] = useState([]);
    const [editing, setEditing] = useState({});
    const [loading, setLoading] = useState(true);
    const [showLogin, setShowLogin] = useState(true);
    
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
    
    const handlePriceChange = (id, value) => {
        setEditing(prev => ({ ...prev, [id]: value }));
    };
    
    const updatePrice = async (id) => {
        try {
            const newPrice = parseFloat(editing[id]);
            await axios.put(
                `http://localhost:4000/api/rooms/${id}`,
                { price: newPrice },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setRooms(rooms.map(r => r.id === id ? { ...r, price: newPrice } : r));
            alert("Fiyat başarıyla güncellendi!");
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
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Çıkış Yap
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Oda Fiyat Yönetimi</h2>
                        <p className="text-blue-100">Oda fiyatlarını aşağıdan düzenleyebilirsiniz</p>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {rooms.map(room => (
                                <div key={room.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between">
                                    <div className="mb-4 md:mb-0 md:w-1/3">
                                        <h3 className="text-lg font-medium text-gray-800">{room.name}</h3>
                                        <p className="text-gray-600">Mevcut fiyat: <span className="font-semibold">{room.price}₺</span></p>
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                            <label htmlFor={`price-${room.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                                Yeni Fiyat (₺)
                                            </label>
                                            <input 
                                                id={`price-${room.id}`}
                                                type="number" 
                                                min="0"
                                                step="any"
                                                defaultValue={room.price} 
                                                onChange={e => handlePriceChange(room.id, e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                                placeholder="Yeni fiyat giriniz"
                                            />
                                        </div>
                                        
                                        <div className="flex items-end">
                                            <button 
                                                onClick={() => updatePrice(room.id)}
                                                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
                                                disabled={!editing[room.id] || parseFloat(editing[room.id]) === room.price}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Güncelle
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Otelim Yönetim Paneli. Tüm hakları saklıdır.</p>
                </div>
            </div>

            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl w-80">
                    <LoginBox onClose={() => setShowLogin(false)} />
                  </div>
                </div>
              )}
        </div>
    );
};

export default AdminPanel;