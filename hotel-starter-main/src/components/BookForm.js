import React, { useContext } from 'react';
//components
import AdultsDropdown from '../components/AdultsDropdown';
import KidsDropdown from '../components/KidsDropdown';
import CheckIn from '../components/CheckIn';
import CheckOut from '../components/CheckOut';
import { RoomContext } from '../context/RoomContext';
import Refresh from './Refresh';
import RoomType from './RoomsType'

const BookForm = () => {
  const {handleClick} = useContext(RoomContext)
  return <form className='h-[300px] w-full lg:h-[70px]'>
    <div className='flex flex-col w-full h-full lg:flex-row'>
      <div className='flex-1 border-r'>
        <RoomType />
      </div>
      <div className='flex-1 border-r'>
        <AdultsDropdown />
      </div>
      <div className='flex-1 border-r'>
        <KidsDropdown />
      </div>
      <div className='flex-1 border-r'>
        <Refresh /> 
      </div>

      <button onClick={(e)=> handleClick(e)} type='submit' className='btn btn-primary'>Hemen İncele</button>
    </div>
  </form>;
};

export default BookForm;
