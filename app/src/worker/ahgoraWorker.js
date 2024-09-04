import AppService from "../service/appService";

export function hello(name) {
    console.log("estou na thread")
 return `Hello, ${name}`;
}


export async function consultaPonto(year, month, force = false) {
  const anoMesAnterior = obterMesAnterior(year, month);

  let mesAnterior = await AppService.espelhoPonto(
    anoMesAnterior.year,
    anoMesAnterior.month,
    force
  );
  let mesAtual = await AppService.espelhoPonto(year, month, force);
  mesAtual.dias = { ...mesAnterior.dias, ...mesAtual.dias };
  return mesAtual;
}

function obterMesAnterior(ano, mes) {
  const data = new Date(ano, mes - 1);
  data.setMonth(data.getMonth() - 1);

  const mesAnterior = data.getMonth() + 1;
  const anoAnterior = data.getFullYear();

  return { year: anoAnterior, month: mesAnterior };
}