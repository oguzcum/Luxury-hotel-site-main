import React, { useState, useEffect } from "react";
//logo
import LogoDark from "../assets/img/balatlogo.png";
import LogoWhite from "../assets/img/balatlogo.png";


const Header = () => {
  const [header, setHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeader(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const changeLang = (lang) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <header
      className={`${
        header ? "bg-white py-4 shadow-lg" : "bg-transparent py-6"
      } fixed z-50 w-full transition-all duration-500`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href='/' className='flex-shrink-0'>
                  <img
                    src={header ? LogoDark : LogoWhite}
                    alt='Logo'
                    className='h-10 lg:h-12' // yazılarla orantılı yükseklik
                  />
                </a>

        {/* Navigation */}
        <nav
          className={`${
            header ? "text-primary" : "text-white"
          } flex gap-x-4 font-tertiary tracking-[3px] text-[15px] items-center lg:gap-x-8`}
        >
         
           <a href='/' className='hover:text-accent transition'>ANASAYFA</a>
          
          
          <a href="/#odalar" className="hover:text-accent transition">
            ODALAR
          </a>
          <a href="/#iletisim" className="hover:text-accent transition">
            İLETİŞİM
          </a>
          <a href='/about' className='hover:text-accent transition'>HAKKIMIZDA</a>

          {/* Google Translate */}
          <div id="google_translate_element" className="hidden"></div>
          <div className="flags">
            
            <button onClick={() => changeLang("en")}><img src="//ademcakir.com.tr/wp-content/plugins/gtranslate/flags/24/en.png"></img></button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
