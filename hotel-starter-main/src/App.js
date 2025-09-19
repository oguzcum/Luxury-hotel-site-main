import React from 'react';
// components
import Header from './components/Header';
import Footer from './components/Footer';
//pages
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import AdminPanel from './pages/AdminPanel';

// react router
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import WhatsAppChat from './components/WhatsAppChat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/room/:id',
    element: <RoomDetails />,
  },
  {
    path: '/admin',
    element: <AdminPanel />
  }
]);

const App = () => {
  return <div>
    <Header />
    <RouterProvider router={router}/>
    <Footer />
    <WhatsAppChat />  
  </div>;
};

export default App;
