import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginBox({ onClose }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");



const handleLogin = async () => {
  try {
    const res = await axios.post("http://localhost:4000/api/admin", {
      username,
      password,
    });

    // Gelen token'i kaydet
    localStorage.setItem("token", res.data.token);
    alert("Giriş başarılı!");
    onClose();
    navigate("/admin");
  } catch (err) {
    alert("Giriş başarısız!");
  }
};


  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-700">Admin Giriş</h2>
      <input 
        type="text" 
        placeholder="İsim" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
      <input 
        type="password" 
        placeholder="Şifre" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
      <div className="flex justify-between items-center">
        <button 
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Giriş Yap
        </button>
        
      </div>
    </div>
  );
}