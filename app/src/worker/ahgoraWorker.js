import AhgoraService from "../service/ahgoraService";

export function hello(name) {
    console.log("estou na thread")
 return `Hello, ${name}`;
}


export async function consultaPonto(year, month) {
    return await AhgoraService.espelhoPonto(year,month);
  }
  