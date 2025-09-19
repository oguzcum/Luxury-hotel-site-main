import React from 'react';
//logo
import LogoWhite from '../assets/img/balatlogo.png';
import { FaInstagram, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id='iletisim' className='bg-primary py-12'>
      <div className='container mx-auto text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-y-6'>
        {/* Logo */}
        <a href='https://share.google/bG29Od7QzuRyFZ8Lt' target='_blank' rel='noopener noreferrer'>
          <img className='w-[160px] md:w-[120px]' src={LogoWhite} alt='Logo'/>
        </a>

        {/* İletişim Bilgileri */}
        <div className='flex flex-col gap-y-2 text-white'>
          <a href='https://www.google.com/maps/place/Balat,+Akgül+Sk.+No:7,+34087+Fatih/İstanbul' target='_blank' rel='noopener noreferrer' className='flex items-center gap-x-2 hover:text-accent transition'>
            <FaMapMarkerAlt /> Balat, Akgül Sk. No:7, 34087 Fatih/İstanbul
          </a>
          <a href='tel:05301109383' className='flex items-center gap-x-2 hover:text-accent transition'>
            <FaPhone /> 0530 110 93 83
          </a>
          <a href='https://www.instagram.com/pinkhome.balat/' target='_blank' rel='noopener noreferrer' className='flex items-center gap-x-2 hover:text-accent transition'>
            <FaInstagram /> @pinkhome.balat
          </a>
        </div>

        {/* Telif hakkı */}
        <span className='mt-4 md:mt-0'>&copy; 2025. Tüm Hakları Korunmaktadır.</span>
      </div>
    </footer>
  );
};

export default Footer;
