import { React, useState  } from "react";
import "./resume.css";
import AhgoraService from "../../service/ahgoraService";

function Resume(props) {

  const date = props.date;
  const mirrorDayInfo = props.mirrorDayInfo;
  const mirrorMonthInfo = props.mirrorMonthInfo;

  const [registerInProgress, setRegisterInProgress] = useState(false);

  function updateMirror() {
    let ano = date.getFullYear();
    let mes = String(date.getMonth() + 1).padStart(2, "0")

    AhgoraService.espelhoPonto(ano,mes).then(
      (result) => {
        props.mirror = result;      
        console.log('funcionou!')  
        setRegisterInProgress(false);
        props.onRegister();
      },
      (error) => {
        console.log("erro!");
      }
    );
  }

  const registrarPonto = (event) => {
    setRegisterInProgress(true);

    window.Neutralino.storage.getData("userDetails").then((result) => {
      let user = JSON.parse(result)

      AhgoraService.baterPonto(user).then(
        (result) => {
          updateMirror();
        },
        (error) => {
          console.log("erro!");
          setRegisterInProgress(false);
        }
      );
    });
    
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
