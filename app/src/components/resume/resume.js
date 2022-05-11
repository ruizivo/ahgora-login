import { React, useState, useEffect  } from "react";
import "./resume.css";
import AhgoraService from "../../service/ahgoraService";

function Resume(props) {

  const [mirrorDayInfo, setMirrorDayInfo] = useState(props.mirrorDayInfo);
  const [mirrorMonthInfo, setMirrorMonthInfo] = useState(props.mirrorMonthInfo);
  const [registerInProgress, setRegisterInProgress] = useState(false);

  const [mirror, setMirror] = useState(props.mirror);

  function updateMirror() {
    let ano = props.date.getFullYear();
    let mes = String(props.date.getMonth() + 1).padStart(2, "0")

    AhgoraService.espelhoPonto(ano,mes).then(
      (mirror) => {     
        setMirror(mirror);
        props.onRegister(mirror);

        atualizaResumo();

        setRegisterInProgress(false);
      },
      (error) => {
        console.log(error);
      }
    );

  }

  function atualizaResumo() {
    if(mirror){
      const date = new Date(props.date);
      const dateString = date?.toLocaleDateString("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" });
      console.log("batidas: ", mirror.dias[dateString]);
      setMirrorDayInfo(mirror.dias[dateString]);
  
      const dateMonthString = dateString.slice(0, -3);
      console.log("totais: ", mirror.meses[dateMonthString]);
      setMirrorMonthInfo(mirror.meses[dateMonthString]);
    }
  }

  
  useEffect(() => {
    console.log('deveria atualizar')
    atualizaResumo();
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
        <br/>
        <div>
          {mirrorMonthInfo?.totais.map(({ descricao, valor }) => (
            <div className="ctnFlex">
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
