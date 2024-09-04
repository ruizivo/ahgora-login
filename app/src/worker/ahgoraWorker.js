import AppService from "../service/appService";

export function hello(name) {
    console.log("estou na thread")
 return `Hello, ${name}`;
}


export async function consultaPonto(year, month, force = false) {
  let day = new Date().getDate().toString().padStart(2, "0");
  const anoMesAnterior = obterMesAnterior(year, month);

  let mesAnterior = await AppService.espelhoPonto(
    anoMesAnterior.year,
    anoMesAnterior.month,
    force
  );
  let mesAtual = await AppService.espelhoPonto(year, month, force);

  let mes = null;

  if(mesAnterior.dias[year+'-'+month+'-'+day]){
    mes = mesAnterior;
  } else {
    mes = mesAtual;
  }
   
  mes.dias = { ...mesAnterior.dias, ...mesAtual.dias };
  return mes;
}

function obterMesAnterior(ano, mes) {
  const data = new Date(ano, mes - 1);
  data.setMonth(data.getMonth() - 1);

  const mesAnterior = data.getMonth() + 1;
  const anoAnterior = data.getFullYear();

  return { year: anoAnterior, month: mesAnterior };
}