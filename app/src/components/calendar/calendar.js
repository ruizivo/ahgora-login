import { useState, React } from "react";
import "./calendar.css";
import Calendar from "react-calendar";
import AhgoraService from "../../service/ahgoraService";
import Resume from "../resume/resume";

function CalendarHive(props) {
  const [mirror, setMirror] = useState(props.data);
  const [value, setValue] = useState(new Date());

  const tileContent = ({ date, view }) => {
    const result = date.toLocaleDateString("en-CA", { year: "numeric",month: "2-digit", day: "2-digit" });
    return view === "month" ? (
      <div className="boxBatidas">
        {mirror.dias[result]?.batidas.map(({ hora, tipo , motivo}) => (
            <p className={`batida ${tipo === "PREVISTA"? "previsto" : ""} ${tipo === "MANUAL"? "esqueceu" : ""}` } title={motivo || tipo}></p>
          ))}
      </div>
      
    ) : null;
  };

  const tileClassName = ({ date, view }) => {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    return view === "month" && date.toDateString() === today.toDateString()
      ? "today"
      : null;
  };

  function onClick(value) {
    //const date = new Date(value);
  };

  const onViewChange = ({ action, activeStartDate, value, view }) => {
    console.log(action, activeStartDate, value, view)
    if(action === 'drillDown' && view === 'month'){
      const today = new Date();
      if(activeStartDate.getMonth() === today.getMonth() && activeStartDate.getFullYear() === today.getFullYear()){             
        updateMirror(today);
      } else {
        updateMirror(activeStartDate);
      }
    }
  };

  const onActiveStartDateChange = ({ action, activeStartDate, value, view }) => 
  {
    console.log(action, activeStartDate, value, view)
    if(view === 'month'){
      const today = new Date();
      if(activeStartDate.getMonth() === today.getMonth() && activeStartDate.getFullYear() === today.getFullYear()){        
        updateMirror(today);
      } else {
        updateMirror(activeStartDate);
      }
    }
  }

  function updateMirror(date) {
    let ano = date.getFullYear();
    let mes = String(date.getMonth() + 1).padStart(2, "0")

    AhgoraService.espelhoPonto(ano,mes).then(
      (result) => {
        setMirror(result);   
        onClick(date); 
        setValue(date);
      },
      (error) => {
        console.log("erro!");
      }
    );
  }

  function updateAfterRegister(mirror){
    let today = new Date();
    setMirror(mirror);   
    setValue(today);
  }

  return (
    <div className="ctnFlex">
      <div className="calendarContent">
        <Calendar
          calendarType={"US"}
          onChange={setValue}
          tileClassName={tileClassName}
          tileContent={tileContent}
          onClickDay={onClick}
          value={value}
          onViewChange={onViewChange}
          onActiveStartDateChange={onActiveStartDateChange}
        />
      </div>

      <Resume date={value} mirror={mirror} onRegister={updateAfterRegister}/>
      
    </div>
  );
}

export default CalendarHive;
