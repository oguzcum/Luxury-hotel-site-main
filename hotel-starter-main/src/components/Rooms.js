import React, { useContext } from 'react';
//context
import { RoomContext } from '../context/RoomContext';
//components
import Room from '../components/Room';
//loading spinner
import { SpinnerDotted } from 'spinners-react';

const Rooms = () => {
  const { rooms, loading } = useContext(RoomContext);

  return (
    <section id='odalar' className='py-24 relative min-h-[400px]'> {/* min-h eklendi ki boşken çökmesin */}
      
      {/* Yükleniyor Ekranı */}
      {loading && (
        <div className='h-screen fixed bottom-0 top-0 bg-black/90 w-full z-50 flex justify-center items-center left-0'>
          <SpinnerDotted color='white' />
        </div>
      )}

      <div className='container mx-auto lg:px-0'>
        <div className='text-center'>
          <h2 className='font-primary text-[45px] mb-4'>Odalar & Daireler</h2>
        </div>

        {/* ODA LİSTESİ VEYA HATA MESAJI */}
        {!loading && rooms.length === 0 ? (
          // --- BURASI YENİ EKLENDİ ---
          <div className='flex flex-col items-center justify-center mt-10 p-8 bg-gray-100 rounded-lg'>
            <div className='text-4xl mb-4'>🚫</div>
            <h3 className='text-2xl font-primary text-gray-600 mb-2'>
              Müsait Oda Bulunmamaktadır
            </h3>
            <p className='text-gray-500'>
              Seçtiğiniz tarihlerde veya kriterlerde uygun oda bulamadık. Lütfen farklı tarihler seçmeyi deneyin.
            </p>
          </div>
          // ---------------------------
        ) : (
          <div className='grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0'>
            {rooms.map((room) => {
              return <Room room={room} key={room.id} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Rooms;