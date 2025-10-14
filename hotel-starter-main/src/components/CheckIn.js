import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import tr from "date-fns/locale/tr";  // Türkçe locale

// Türkçe gün isimleri için
registerLocale("tr", tr);

const CheckIn = () => {
  const [startDate, setStartDate] = useState(null);

  return (
    <div className="relative flex items-center justify-end h-full">
      <div className="absolute z-10 pr-8">
        <BsCalendar className="text-accent text-base" />
      </div>

      <DatePicker
        className="w-full h-full"
        id="1"
        selected={startDate}
        placeholderText="Giriş Tarihi"   // bu kısım çevrilebilir
        onChange={(date) => setStartDate(date)}

        calendarClassName="notranslate"  // günler çevrilmesin
      />
    </div>
  );
};

export default CheckIn;
