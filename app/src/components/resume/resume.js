/* eslint-disable no-undef */
import { React, useState  } from "react";
import "./resume.css";

function Resume(props) {

  const [registerInProgress, setRegisterInProgress] = useState(false);

  const registrarPonto = (event) => {
    setRegisterInProgress(true);

    Neutralino.storage.getData("userDetails").then((result) => {
      
      //let user = JSON.parse(result)

      // AhgoraService.baterPonto(user).then(
      //   (result) => {
      //     console.log("foi!");
      //     getData();
      //   },
      //   (error) => {
      //     console.log("erro!");
      //   }
      // );
      console.log("ponto batido: fake!");
      props.onRegister();
      setRegisterInProgress(false);
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
