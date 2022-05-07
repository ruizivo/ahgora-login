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

  //inputs.user = "0170";
  //inputs.pass = "Hive@147258";

  const loginSubmit = (event) => {
    event.preventDefault();
    let user = {
      company: inputs.company,
      username: inputs.username,
      password: inputs.password,
    };
    login(user)
  };

  function login(user){
    AhgoraService.login(user).then(
      (result) => {
        navigate("/home", { replace: true });
      },
      (error) => {
        //navigate("/login", { replace: true });
        alert(error.message)
      }
    );
  }

  try {
    // eslint-disable-next-line no-undef
    Neutralino.storage.getData("userDetails").then((result) => {
      //console.log(`Data: ${result}`);
      login(JSON.parse(result))
    }, error =>{
      console.log(error.message);
    });
  } catch (error) {
    alert(error.message);
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <form method="post" onSubmit={loginSubmit}>
          <div className="box">
            <h1>Login</h1>
            <input
              placeholder="empresa"
              type="text"
              name="company"
              className="input"
              value={inputs.company || ""}
              onChange={handleChange}
            />
            <input
              placeholder="usuario"
              type="text"
              name="username"
              className="input"
              value={inputs.username || ""}
              onChange={handleChange}
            />

            <input
              placeholder="senha"
              type="password"
              name="password"
              className="input"
              value={inputs.password || ""}
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
