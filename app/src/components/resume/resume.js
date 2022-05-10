import { React, useState  } from "react";
import "./resume.css";
import AhgoraService from "../../service/ahgoraService";

function Resume(props) {

  const [registerInProgress, setRegisterInProgress] = useState(false);

  function updateMirror() {
    let ano = props.date.getFullYear();
    let mes = String(props.date.getMonth() + 1).padStart(2, "0")

    AhgoraService.espelhoPonto(ano,mes).then(
      (result) => {     
        console.log('ponto batido!')  
        setRegisterInProgress(false);
        props.onRegister(result);
        props.update(new Date());
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
          {props.mirrorDayInfo?.batidas.map(({ hora, tipo , motivo}) => (
            <p className={`exibirHora batidainfo ${tipo === "PREVISTA"? "previsto" : ""}`} title={motivo || tipo}>{hora}</p>
          ))}
        </div>
        <div>
          {props.mirrorDayInfo?.totais.map(({ descricao, valor }) => (
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
          {props.mirrorMonthInfo?.totais.map(({ descricao, valor }) => (
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
