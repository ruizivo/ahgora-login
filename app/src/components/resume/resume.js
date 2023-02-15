import { React, useState, useEffect  } from "react";
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';

import AhgoraService from "../../service/ahgoraService";

import "./resume.css";
import Clock from "../clock/clock";

const createWorker = createWorkerFactory(() => import('../../worker/ahgoraWorker'));

function Resume(props) {

  const [selectDay, setSelectDay] = useState(null);
  const [mirrorDayInfo, setMirrorDayInfo] = useState(null);
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(null);
  const [registerInProgress, setRegisterInProgress] = useState(false); 
  
  const worker = useWorker(createWorker)


  async function updateMirror() {
    let ano = props.date.getFullYear();
    let mes = String(props.date.getMonth() + 1).padStart(2, "0")

    const webWorkerEspelho = await worker.consultaPonto(ano, mes)
    props.onRegister(webWorkerEspelho)
    atualizaResumo();
    setRegisterInProgress(false);
  }

  function getDateString(date){
    let year = date.getFullYear()
    let month = (date.getMonth()+1).toString()
    let day = date.getDate().toString()

    if(month.length === 1){
      month = "0"+month
    }

    if(day.length === 1){
      day = "0"+day
    }
    
    return year+'-'+month+'-'+day
  }

  function atualizaResumo() {
    if(props.mirror){
      const dateString = getDateString(new Date(props.date))
      console.log("batidas: ", props.mirror.dias[dateString]);
      setMirrorDayInfo(props.mirror.dias[dateString]);
  
      const dateMonthString = dateString.slice(0, -3);
      console.log("totais: ", props.mirror.meses[dateMonthString]);
      setMirrorMonthInfo(props.mirror.meses[dateMonthString]);

      setSelectDay(new Date(props.date.getTime()));
    }
  }

  
  useEffect(() => {
    if(props.date.getTime() !== selectDay?.getTime()){
      atualizaResumo();
    }
  });

  const registrarPonto = (event) => {
    setRegisterInProgress(true);

    AhgoraService.baterPonto().then(
      (result) => {
        console.log('ponto batido!')  
        updateMirror()
      },
      (error) => {
        console.log(error);
        setRegisterInProgress(false);
      }
    );
    
  };

  return (
    <div className="resumo">
              
        <div className="clock">
          <Clock />
        </div>
        <div className="registraPonto">
          <button onClick={registrarPonto} className='btnRegister' disabled={registerInProgress}>Registrar</button>
        </div>

        <div className="espelho-batidas">
          {mirrorDayInfo?.batidas.map(({ hora, tipo , motivo}) => (
            <p className={`exibirHora batidainfo ${tipo === "PREVISTA"? "previsto" : ""}`} title={motivo || tipo}>{hora}</p>
          ))}
        </div>
        <div>
          {mirrorDayInfo?.totais.map(({ descricao, valor }) => (
            <div className="ctnFlex" key={descricao}>
              <p className="">
                {descricao}
              </p>
              <p className="">
                {valor}
              </p>
            </div>
          ))}
        </div>
        <br/>
        <div>
          {mirrorMonthInfo?.totais.map(({ descricao, valor }) => (
            <div className="ctnFlex" key={descricao}>
              <p className="">
                {descricao.replace('Banco de horas acumulado','Acumulado')}
              </p>
              <p className="">
                {valor}
              </p>
            </div>
          ))}
        </div>

      </div>
  );
}

export default Resume;
