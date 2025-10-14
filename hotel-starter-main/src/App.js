import React from 'react';
// components
import Header from './components/Header';
import Footer from './components/Footer';
// pages
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import AdminPanel from './pages/AdminPanel';
import AboutUs from './pages/AboutUs';

// react router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhatsAppChat from './components/WhatsAppChat';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppChat />
      </div>
    </Router>
  );
};

export default App;