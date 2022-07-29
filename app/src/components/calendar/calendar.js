import { useState, React, useEffect } from "react";
import {
  createWorkerFactory,
  useWorker,
  terminate,
} from "@shopify/react-web-worker";

import Calendar from "react-calendar";
import Resume from "../resume/resume";

import "./calendar.css";

const createWorker = createWorkerFactory(() =>
  import("../../worker/ahgoraWorker")
);

function CalendarHive(props) {
  const [mirror, setMirror] = useState(props.data);
  const [value, setValue] = useState(new Date());

  const worker = useWorker(createWorker);

  async function getData() {
    const date = new Date();
    worker
      .consultaPonto(
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0")
      )
      .then((webWorkerEspelho) => {
        setMirror(webWorkerEspelho);
      });
  }

  useEffect(() => {
    if (mirror === null || mirror === undefined) {
      getData();
    }
  });

  useEffect(() => {
    return () => {
      terminate(worker);
    };
  }, [worker]);

  const tileContent = ({ date, view }) => {
    const result = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    if (mirror?.dias[result]?.afastamentos === 1) {
      return (
        <div className="boxBatidas">
          <i class="bi bi-star" />
        </div>
      );
    }

    return view === "month" ? (
      <div className="boxBatidas">
        {mirror?.dias[result]?.batidas.map(({ hora, tipo, motivo }) => (
          <p
            className={`batida ${tipo === "PREVISTA" ? "previsto" : ""} ${
              tipo === "MANUAL" ? "esqueceu" : ""
            }`}
            title={
              motivo !== undefined
                ? `Ponto corrigido - Motivo: ${motivo}`
                : tipo
            }
            key={hora}
          />
        ))}
      </div>
    ) : null;
  };

  const tileClassName = ({ date, view }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return view === "month" && date.toDateString() === today.toDateString()
      ? "today"
      : null;
  };

  function onClick(value) {
    // const date = new Date(value);
  }

  const onViewChange = ({ action, activeStartDate, value, view }) => {
    console.log(action, activeStartDate, value, view);
    if (action === "drillDown" && view === "month") {
      const today = new Date();
      if (
        activeStartDate.getMonth() === today.getMonth() &&
        activeStartDate.getFullYear() === today.getFullYear()
      ) {
        updateMirror(today);
      } else {
        updateMirror(activeStartDate);
      }
    }
  };

  const onActiveStartDateChange = ({
    action,
    activeStartDate,
    value,
    view,
  }) => {
    console.log(action, activeStartDate, value, view);
    if (view === "month") {
      const today = new Date();
      if (
        activeStartDate.getMonth() === today.getMonth() &&
        activeStartDate.getFullYear() === today.getFullYear()
      ) {
        updateMirror(today);
      } else {
        updateMirror(activeStartDate);
      }
    }
  };

  async function updateMirror(date) {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");

    const webWorkerEspelho = await worker.consultaPonto(ano, mes);
    setMirror(webWorkerEspelho);
    onClick(date);
    setValue(date);
  }

  function updateAfterRegister(mirror) {
    const today = new Date();
    setMirror(mirror);
    setValue(today);
  }

  return (
    <div className="ctnFlex">
      <div className="calendarContent">
        <Calendar
          calendarType="US"
          onChange={setValue}
          tileClassName={tileClassName}
          tileContent={tileContent}
          onClickDay={onClick}
          value={value}
          onViewChange={onViewChange}
          onActiveStartDateChange={onActiveStartDateChange}
        />
      </div>

      <Resume mirror={mirror} date={value} onRegister={updateAfterRegister} />
    </div>
  );
}

export default CalendarHive;
