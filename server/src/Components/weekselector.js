import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import UseDatecontext from "./context/useDate";

function Weekselector() {
  const today = new Date();
  const defaultFrom = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: 1,
  };

  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const defaultTo = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: lastDayOfMonth.getDate(),
  };

  const defaultRange = {
    from: defaultFrom,
    to: defaultTo,
  };

  const { data, updateData } = UseDatecontext();
  const [selectedDayRange, setSelectedDayRange] = useState(defaultRange);
  const handleChange = (selectedRange) => {
   
      setSelectedDayRange(selectedRange);
      updateData(selectedRange);
    
  };

  return (
    <div>
      {/* <Calendar
        value={selectedDayRange}
        onChange={(selectedRange) => setSelectedDayRange(selectedRange)}
        shouldHighlightWeekends
      /> */}
      <Calendar
        value={selectedDayRange}
        onChange={handleChange}
        shouldHighlightWeekends
      />
    </div>
  );
}

export default Weekselector;
