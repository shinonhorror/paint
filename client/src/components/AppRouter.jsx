import React, { useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext, NameContext } from "../context";
import Toolbar from "./Toolbar";
import SettingBar from "./SettingBar";
import Canvas from "./Canvas";
import Login from "./../Pages/Login";

const AppRouter = () => {
  const { isAuth, setIsAuth, isLoading } = useContext(AuthContext);
  const uid = JSON.parse(localStorage.getItem("id"));

  return isAuth ? (
    <Routes>
      <Route
        path="/:id"
        element={
          <>
            <Toolbar />
            <SettingBar />
            <Canvas />
          </>
        }
      />
      <Route
        path="/*"
        element={
          <>
            <Toolbar />
            <SettingBar />
            <Canvas />
            <Navigate to={`/${uid}`} replace />
          </>
        }
      />
    </Routes>
  ) : (
    <Routes>
      <Route path="auth/login" element={<Login />} />
      <Route path="/*" element={<Navigate to={"auth/login"} />} />
    </Routes>
  );
};

export default AppRouter;
