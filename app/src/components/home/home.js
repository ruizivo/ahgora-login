import { useState, React, useEffect  } from "react";
import AhgoraService from "../../service/ahgoraService";
import CalendarHive from "../calendar/calendar";
import Loading from "../loading/login";
import "./home.css";

function Home() {

  const [data, setData] = useState(null);

  function getData(){
    const date = new Date();
    AhgoraService.espelhoPonto(date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0")).then(
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

  function ShowHome(props) {
    const isOK = props.isOK;
    if (isOK) {
      return (
          <CalendarHive data={data}/>
      );
    }
    return (
      <div>
        <div className="App">
        <header className="App-header">
          <Loading/>
        </header>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ShowHome isOK={data != null}/>
    </div>
  );
}

export default Home;
