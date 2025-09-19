import React, { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

const Refresh = () => {
  const { resetFilters } = useContext(RoomContext);
  
  return (
    <button 
      type="button" 
      onClick={resetFilters}
      className='bg-[#d1935a] w-full h-full hover:bg-[#b07a48] text-white font-semibold'
    >
      Filtreleri Sıfırla
    </button>
  );
};

export default Refresh;