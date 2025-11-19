import React, { useContext } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import tr from "date-fns/locale/tr";
import { RoomContext } from "../context/RoomContext";

registerLocale("tr", tr);

const CheckOut = () => {
  const { checkOutDate, setCheckOutDate, checkInDate } = useContext(RoomContext);

  return (
    <div className="relative flex items-center justify-end h-full">
      <div className="absolute z-10 pr-8">
        <BsCalendar className="text-accent text-base" />
      </div>

      <DatePicker
        className="w-full h-full"
        selected={checkOutDate}
        onChange={(date) => setCheckOutDate(date)}
        placeholderText="Çıkış Tarihi"
        locale="tr"
        minDate={checkInDate || new Date()} // çıkış tarihi girişten önce olamaz
        calendarClassName="notranslate"
      />
    </div>
  );
};

export default CheckOut;
