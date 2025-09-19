import React, { useState, useEffect } from 'react';
//logo
import LogoDark from '../assets/img/balatlogo.png';
import LogoWhite from '../assets/img/balatlogo.png';

const Header = () => {
  const [header, setHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${header ? 'bg-white py-4 shadow-lg' : 'bg-transparent py-6'} fixed z-50 w-full transition-all duration-500`}>
      <div className='container mx-auto flex items-center justify-between'>
        {/* Logo */}
        <a href='/' className='flex-shrink-0'>
          <img
            src={header ? LogoDark : LogoWhite}
            alt='Logo'
            className='h-10 lg:h-12' // yazılarla orantılı yükseklik
          />
        </a>

        {/* Navigation */}
        <nav className={`${header ? 'text-primary' : 'text-white'} flex gap-x-4 font-tertiary tracking-[3px] text-[15px] items-center lg:gap-x-8`}>
          <a href='/' className='hover:text-accent transition'>ANASAYFA</a>
          <a href='/#odalar' className='hover:text-accent transition'>ODALAR</a>
          <a href='/#iletisim' className='hover:text-accent transition'>İLETİŞİM</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
