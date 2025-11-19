import React, { useContext } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import tr from "date-fns/locale/tr";
import { RoomContext } from "../context/RoomContext";

registerLocale("tr", tr);

const CheckIn = () => {
  const { checkInDate, setCheckInDate } = useContext(RoomContext);

  return (
    <div className="relative flex items-center justify-end h-full">
      <div className="absolute z-10 pr-8">
        <BsCalendar className="text-accent text-base" />
      </div>

      <DatePicker
        className="w-full h-full"
        selected={checkInDate}
        onChange={(date) => setCheckInDate(date)}
        placeholderText="Giriş Tarihi"
        locale="tr"
        minDate={new Date()}
        calendarClassName="notranslate"
      />
    </div>
  );
};

export default CheckIn;
