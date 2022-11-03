import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context";
import { v4 as uuidv4 } from "uuid";
import canvasState from "../store/canvasState";

const Login = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const downloadLocalStorage = (name, id) => {
    localStorage.setItem("name", name);
    localStorage.setItem("id", JSON.stringify(id));
  };

  const connectionHandler = () => {
    canvasState.setUsername(name);
    const uid = uuidv4();
    downloadLocalStorage(name, uid);
  };
  
  const enterHandler = () => {
    canvasState.setUsername(name);
    downloadLocalStorage(name, id);
  };

  const login = (e) => {
    e.preventDefault();
    setIsAuth(true);
    localStorage.setItem("auth", "true");
  };
  return (
    <div>
      <h1>Зарегистрировать комнату</h1>
      <form onSubmit={(e) => login(e)}>
        <input
          type="text"
          placeholder="Введите имя"
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={() => connectionHandler()}>Создать комнату</button>
      </form>
      <h1>Страница регистрации</h1>
      <form onSubmit={(e) => login(e)}>
        <input
          type="text"
          placeholder="Введите имя"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Введите номер комнаты"
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={() => enterHandler()}>Войти в комнату</button>
      </form>
    </div>
  );
};
export default Login;
