import React, { useContext } from 'react';
//components


import { RoomContext } from '../context/RoomContext';
import Refresh from './Refresh';
import RoomType from './RoomsType'
import CheckIn from './CheckIn';
import CheckOut from './CheckOut';

const BookForm = () => {
  const {handleClick} = useContext(RoomContext)
  return <form className='h-[300px] w-full lg:h-[70px]'>
    <div className='flex flex-col w-full h-full lg:flex-row'>
      <div className='flex-1 border-r'>
        <RoomType />
      </div>
      <div className='flex-1 border-r '>
        <CheckIn/>
      </div>
      <div className='flex-1 border-r'>
        <CheckOut />
      </div>
      <div className='flex-1 border-r'>
        <Refresh /> 
      </div>
      


    </div>
  </form>;
};

export default BookForm;
