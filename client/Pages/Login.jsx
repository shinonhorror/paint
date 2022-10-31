import React, { useContext } from "react";
import { AuthContext } from "../context";

const Login = ({username, setUsername, connect}) => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const login = (e) => {
    e.preventDefault();
    setIsAuth(true);
    localStorage.setItem("auth", "true");
  };
  return (
    <div>
      <h1>Страница регистрации</h1>
      <form onSubmit={(e) => login(e)}>
        <input type="text" placeholder="Введите имя" value = {username} onChange={setUsername(e.target.value)}/>
        <button onClick={connect}>Создать комнату</button>
      </form>
    </div>
  );
};
export default Login;
