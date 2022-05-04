import { useState, React } from "react";
import AhgoraService from "../../service/ahgoraService";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  inputs.user = "0170";
  inputs.pass = "Hive@147258";

  const loginSubmit = (event) => {
    event.preventDefault();
    let user = {
      user: inputs.user,
      pass: inputs.pass,
    };
    AhgoraService.login(user).then(
      (result) => {
        navigate("/home", { replace: true });
      },
      (error) => {
        alert("Usuário ou senha inválida!");
      }
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <form method="post" onSubmit={loginSubmit}>
          <div className="box">
            <h1>Login</h1>
            <input
              placeholder="usuario"
              type="text"
              name="user"
              className="input"
              value={inputs.user || ""}
              onChange={handleChange}
            />

            <input
              placeholder="senha"
              type="password"
              name="pass"
              className="input"
              value={inputs.pass || ""}
              onChange={handleChange}
            />

            <input type="submit" className="btn" />
          </div>
        </form>
      </header>
    </div>
  );
}

export default Login;
