import { useState, React } from "react";
import "./calendar.css";
import Calendar from "react-calendar";

function CalendarHive() {
  const [value, onChange] = useState(new Date());

  const tileContent = ({ date, view }) => {
    return view === "month" && date.getDay() === 2 ? (
      <p className="batida"></p>
    ) : null;
  };

  const tileClassName = ({ date, view }) => {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    return view === "month" && date.toDateString() === today.toDateString()
      ? "today"
      : null;
  };

  const onClick = (value) => {
    console.log("New date is: ", value.getDate());
  };

  return (
    <Calendar
      calendarType={"US"}
      onChange={onChange}
      showNavigation={false}
      tileClassName={tileClassName}
      tileContent={tileContent}
      onClickDay={onClick}
      value={value}
    />
  );
}

export default CalendarHive;
