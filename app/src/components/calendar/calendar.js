import { useState, React, useEffect } from "react";
import "./calendar.css";
import Calendar from "react-calendar";
import AhgoraService from "../../service/ahgoraService";

function CalendarHive(props) {
  const [mirror, setMirror] = useState(props.data);
  const [value, onChange] = useState(new Date());
  const [mirrorDayInfo, setMirrorDayInfo] = useState(null);

  useEffect(() => {
    if (mirrorDayInfo == null) {
      const result = value.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      console.log("ponto: ", mirror.dias[result]);
      setMirrorDayInfo(mirror.dias[result]);
    }
  });

  const tileContent = ({ date, view }) => {
    const result = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    //mirror.dias[result]
    return view === "month" ? (
      <div className="boxBatidas">
        {/* <p className="batida"></p>
        <p className="batida"></p> */}
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
    const result = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    console.log("ponto: ", mirror.dias[result]);
    setMirrorDayInfo(mirror.dias[result]);
  };

  const onViewChange = ({ action, activeStartDate, value, view }) => {
    updateMirror(activeStartDate);
  };

  const onActiveStartDateChange = ({ action, activeStartDate, value, view }) => 
  {
    updateMirror(activeStartDate);
  }

  function updateMirror(date) {
    AhgoraService.espelhoPonto(
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0")
    ).then(
      (result) => {
        setMirror(result);
      },
      (error) => {
        console.log("erro!");
      }
    );
  }

  return (
    <div className="ctnFlex">
      <div className="calendarContent">
        <Calendar
          calendarType={"US"}
          onChange={onChange}
          tileClassName={tileClassName}
          tileContent={tileContent}
          onClickDay={onClick}
          value={value}
          onViewChange={onViewChange}
          onActiveStartDateChange={onActiveStartDateChange}
        />
      </div>

      <div className="resumo">
        <div className="espelho-batidas">
          {mirrorDayInfo?.batidas.map(({ hora, tipo , motivo}) => (
            <p className={`exibirHora batidainfo ${tipo === "PREVISTA"? "previsto" : ""}`} title={motivo || tipo}>{hora}</p>
          ))}
        </div>
        <div>
          {mirrorDayInfo?.totais.map(({ descricao, valor }) => (
            <div className="ctnFlex">
              <p className="">
                {descricao}
              </p>
              <p className="">
                {valor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarHive;
