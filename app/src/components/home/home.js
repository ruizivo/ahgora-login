import { useState, React, useEffect  } from "react";
import AhgoraService from "../../service/ahgoraService";
import CalendarHive from "../calendar/calendar";
import "./home.css";

function Home() {

  const [data, setData] = useState(null);

  function getData(){
    AhgoraService.espelhoPonto('2022', '05').then(
      (result) => {
        setData(result)
      },
      (error) => {
        console.log("erro!");
      }
    );
  }
  

  useEffect(() => {
    if(data == null){
      getData();
    }
  });

  function ShowCalendar(props) {
    const isOK = props.isOK;
    if (isOK) {
      return <CalendarHive data={data}/>;
    }
    return <h1>Carregando!</h1>;
  }


  return (
    <div>
      <ShowCalendar isOK={data != null}/>
    </div>
  );
}

export default Home;
