import React from 'react';
// import swiper react components
import {Swiper, SwiperSlide} from 'swiper/react';
// import swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
// import required modules
import {EffectFade, Autoplay} from 'swiper';
//images
const Img1 = '/balatodalar/Artist Antik 1/1e4.jpg';
const Img2 = '/balatodalar/Pinkom 4/pinkom4e2.jpg';
const Img3 = '../assets/img/heroSlider/3.jpg';

const slides = [
  {
    title: 'UNUTULMAZ TATİLLER İÇİN LÜKS KONAKLAMA',
    bg: Img1,
    btnText: 'ODALARIMIZI KEŞFEDİN',
  },
  {
    title: 'UNUTULMAZ TATİLLER İÇİN LÜKS KONAKLAMA',
    bg: Img2,
    btnText: 'ODALARIMIZI KEŞFEDİN',
  },
  {
    title: 'UNUTULMAZ TATİLLER İÇİN LÜKS KONAKLAMA',
    bg: Img3,
    btnText: 'ODALARIMIZI KEŞFEDİN',
  },
];

const HeroSlider = () => {
  return (
    <Swiper modules={[EffectFade, Autoplay]} effect={'fade'} loop={true} autoplay={{delay: 3000, disableOnInteraction: false,}} className='heroSlider h-[600px] lg:h-[860px]'>
      {slides.map((slide,index)=> {
        
        const {title, bg, btnText} = slide;
        return <SwiperSlide className='h-full relative flex justify-center items-center' key={index}>
          <div className='z-20 text-white text-center'>
            <div className='font-tertiary tracking-[6px] mb-5'>KEYFİNİZE BAKIN VE DİNLENİN</div>
            <h1 className='text-[32px] font-primary tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6'>{title}</h1>
            {/* <button href='/#odalar' className='btn btn-lg btn-primary mx-auto'>{btnText}</button> */}
            {/* <a href='/#odalar' className='btn btn-lg btn-primary mx-auto'>
  {btnText}
</a> */}
<a
  href="/#odalar"
  className="btn btn-primary inline-block mx-auto px-6 py-3 text-center text-white text-lg  rounded-lg max-w-xs w-full sm:w-auto transition hover:bg-pink-600"
>
  {btnText}
</a>

          </div>
          <div className='absolute top-0 w-full h-full'>
            <img className='object-cover h-full w-full' src={bg} alt=''/>
          </div>
          
          <div className='absolute w-full h-full bg-black/70'></div>
        </SwiperSlide>;
      })}
    </Swiper>
  );
};

export default HeroSlider;
