import AppService from "../service/appService";

export function hello(name) {
    console.log("estou na thread")
 return `Hello, ${name}`;
}


export async function consultaPonto(year, month) {
    return await AppService.espelhoPonto(year,month);
  }
  