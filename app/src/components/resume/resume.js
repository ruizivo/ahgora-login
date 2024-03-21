import { React, useState, useEffect  } from "react";
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import AppService from "../../service/appService";


import "./resume.css";
import Clock from "../clock/clock";

const createWorker = createWorkerFactory(() => import('../../worker/ahgoraWorker'));
let timerVar
let intervalo = 10 * 1000 // 10 segundos
const maxIntervalo = 1 * 60 * 1000 * 60 // 1 hora

function Resume(props) {

  const [selectDay, setSelectDay] = useState(null);
  const [mirrorDayInfo, setMirrorDayInfo] = useState(null);
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(null);
  const [registerInProgress, setRegisterInProgress] = useState(false); 
  const [lastUpdate, setlastUpdate] = useState(null);
  
  const worker = useWorker(createWorker)


  function timer(){
    
    console.log("timer...", intervalo)
    clearInterval(timerVar)
    intervalo = parseInt(Math.min(intervalo * 1.3, maxIntervalo))
    timerVar = setInterval(function() {
      console.log("atualizando..")
      AppService.atualizaPonto().then( result => {
        updateMirror(true)
      })
    }, intervalo)
}

  async function updateMirror(force=false) {
    let ano = props.date.getFullYear();
    let mes = String(props.date.getMonth() + 1).padStart(2, "0")

    const webWorkerEspelho = await worker.consultaPonto(ano, mes, force)
    props.onRegister(webWorkerEspelho)
    atualizaResumo();
    setRegisterInProgress(false);
    setlastUpdate(new Date().toLocaleString())
  }

  function getDateString(date){
    let year = date.getFullYear()
    let month = (date.getMonth()+1).toString().padStart(2, "0")
    let day = date.getDate().toString().padStart(2, "0")
   
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
          updateMirror()
          intervalo = 10000
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
            <p className={`exibirHora batidainfo ${tipo.toLowerCase()}`} title={motivo || tipo}>{hora}</p>
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
