import React, { useState, useEffect } from "react";
import { AuthContext} from "./context";
import AppRouter from "./components/AppRouter";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/app.scss";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setIsAuth(true);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
      }}
    >
      <Router>
        <div className="app">
          <AppRouter />
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
