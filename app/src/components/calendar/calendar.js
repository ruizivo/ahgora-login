import { useState, React } from "react";
import "./calendar.css";
import Calendar from "react-calendar";
import AhgoraService from "../../service/ahgoraService";
import Resume from "../resume/resume";

function CalendarHive(props) {
  const [mirror, setMirror] = useState(props.data);
  const [value, setValue] = useState(new Date());
  const [mirrorDayInfo, setMirrorDayInfo] = useState(mirror?.dias[value.toLocaleDateString("en-CA", { year: "numeric",month: "2-digit", day: "2-digit" })]);
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(null);

  function initMirrorDay(){
    const result = value?.toLocaleDateString("en-CA", { year: "numeric",month: "2-digit", day: "2-digit" });
    let ponto = mirror?.dias[result]
    console.log("ponto: ", ponto);
    return ponto;
  }

  // if (mirrorDayInfo == null) {
  //   const result = value?.toLocaleDateString("en-CA", { year: "numeric",month: "2-digit", day: "2-digit" });
  //   let ponto = mirror?.dias[result]
  //   console.log("ponto: ", ponto);
    
  //   setMirrorDayInfo(ponto);
  // }


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

  const onClick = (value) => {
    const date = new Date(value);
    const dateString = date?.toLocaleDateString("en-CA", {year: "numeric",month: "2-digit",day: "2-digit"});
    console.log("batidas: ", mirror.dias[dateString]);
    setMirrorDayInfo(mirror.dias[dateString]);

    const dateMonthString = dateString.slice(0, -3);
    console.log("totais: ", mirror.meses[dateMonthString]);
    setMirrorMonthInfo(mirror.meses[dateMonthString]);
  };

  const onViewChange = ({ action, activeStartDate, value, view }) => {
    updateMirror(activeStartDate);
  };

  const onActiveStartDateChange = ({ action, activeStartDate, value, view }) => 
  {
    updateMirror(activeStartDate);
  }

  function updateMirror(date) {
    let ano = date.getFullYear();
    let mes = String(date.getMonth() + 1).padStart(2, "0")

    AhgoraService.espelhoPonto(ano,mes).then(
      (result) => {
        setMirror(result);      
        console.log('funcionou!')  
      },
      (error) => {
        console.log("erro!");
      }
    );
  }

  function updateAfterRegister(){
    let today = new Date();
    onClick(today)
    updateMirror(today);
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

      <Resume mirrorDayInfo={mirrorDayInfo} mirrorMonthInfo={mirrorMonthInfo} onRegister={updateAfterRegister}/>
      
    </div>
  );
}

export default CalendarHive;
