import AhgoraService from "../../service/ahgoraService";
import CalendarHive from "../calendar/calendar";
import "./home.css";

function Home() {

  AhgoraService.espelhoPonto('2022', '05')

  return (
    <div>
      <CalendarHive/>
    </div>
  );
}

export default Home;
