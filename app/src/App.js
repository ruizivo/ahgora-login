import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import Home from "./components/home/home";

function App() {

  document.addEventListener("contextmenu", function (e){
      e.preventDefault();
  }, false);

  function ShowApp(props) {
    const isOK = props.isOK;
    if (isOK) {
      return (
        <Router>
        <Routes>
            <Route path="" exact element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      );
    }

    
    return (
      <div>
        <div className="App">
        <header className="App-header">
          <h1>Carregando!</h1>
        </header>
        </div>
      </div>
      );
  }


  return (
    <ShowApp isOK={true}/>
  );
}

export default App;
