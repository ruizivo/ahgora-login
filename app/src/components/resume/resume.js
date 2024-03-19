import { React, useState, useEffect  } from "react";
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';

import AppService from "../../service/appService";

import "./resume.css";
import Clock from "../clock/clock";

const createWorker = createWorkerFactory(() => import('../../worker/ahgoraWorker'));
let timerVar

function Resume(props) {

  const [selectDay, setSelectDay] = useState(null);
  const [mirrorDayInfo, setMirrorDayInfo] = useState(null);
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(null);
  const [registerInProgress, setRegisterInProgress] = useState(false); 
  const [lastUpdate, setlastUpdate] = useState(null);
  
  const worker = useWorker(createWorker)

  

  function timer(){
    var sec = 10;
    console.log("timer...", sec)
    clearInterval(timerVar)
    timerVar = setInterval(function() {
      clearInterval(timerVar)
      console.log("atualizando..")
      AppService.atualizaPonto().then( result => {
        setlastUpdate(new Date().toLocaleString())
        updateMirror()
      })
    }, sec * 1000)
}

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
      console.log("batidas: ", props.mirror);

      setMirrorDayInfo(props.mirror.dias[dateString]);
      setMirrorMonthInfo(props.mirror.total);
      setSelectDay(new Date(props.date.getTime()));
      
    }
  }


  
  useEffect(() => {
    if(props.date.getTime() !== selectDay?.getTime()){
      atualizaResumo();
      timer()
    }
  });

  const registrarPonto = (event) => {
    setRegisterInProgress(true);

    AppService.baterPonto().then(
      (result) => {
        //console.log('ponto batido!')  
        //setTimeout(() => {
          
          updateMirror()
        //}, 3000);
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
        {lastUpdate && <div className="lastUpdate">última atualização: {lastUpdate}</div>}
      </div>
  );
}

export default Resume;
