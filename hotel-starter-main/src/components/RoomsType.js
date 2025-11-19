import React,{useContext} from 'react';
//room context
import { RoomContext } from '../context/RoomContext';
// headless ui menu
import {Menu} from '@headlessui/react'
//icons
import {BsChevronDown} from 'react-icons/bs'

const options = [
  { value: 'Tümü', label: 'Tüm Odalar' },
  { value: 'Pink Home', label: 'Pink Home' },
  { value: 'Artist Antik', label: 'Artist Antik' },
];

const RoomsType = () => {
  const { roomType, setRoomType } = useContext(RoomContext);

  // label'ı bul (varsayılan gösterim)
  const currentLabel = options.find(o => o.value === roomType)?.label ?? roomType ?? 'Oda Türü';

  return (
    <Menu as='div' className='w-full h-full bg-white relative'>
      <Menu.Button className='w-full h-full flex items-center justify-between px-8'>
        {currentLabel}
        <BsChevronDown className='text-base text-accent-hover'/>
      </Menu.Button>

      <Menu.Items as='ul' className='bg-white absolute w-full flex flex-col z-40'>
        {options.map((opt, index) => (
          <Menu.Item key={index} as='li'>
            {({ active }) => (
              <div
                onClick={() => setRoomType(opt.value)}
                className={`border-b last-of-type:border-b-0 h-12 hover:bg-accent hover:text-white w-full flex justify-center items-center cursor-pointer ${active ? 'bg-accent text-white' : ''}`}
              >
                {opt.label}
              </div>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default RoomsType;