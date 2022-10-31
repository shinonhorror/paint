import React from "react";
import { useMemo, useState, useEffect } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/toolbar.scss";

const SettingBar = () => {
  const changeLineWidth = (e) => {
    toolState.setLineWidth(e.target.value);
  };
  const changeSize = (e) => {
    const size = e.target.value.split(",");
    canvasState.socket.send(
      JSON.stringify({
        method: "draw",
        id: canvasState.sessionId,
        figure: {
          type: "size",
          w: size[0],
          h: size[1],
        },
      })
    );
  };
  return (
    <div className="settings-bar">
      <label htmlFor="line-width">Толщина линии</label>
      <input
        onChange={(e) => changeLineWidth(e)}
        style={{ margin: "0 10px" }}
        id="line-width"
        type="number"
        defaultValue={1}
        min={1}
        max={50}
      />
      <label htmlFor="stroke-color">Цвет обводки</label>
      <input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        style={{ margin: "0 10px" }}
        id="stroke-color"
        type="color"
      />
      <label htmlFor="paint-size">Размер холста </label>
      <select
        onChange={(e) => changeSize(e)}
        id="paint-size"
        style={{ margin: "0 10px" }}
      >
        <option value="600,400">600x400</option>
        <option value="1200,700">1200x700</option>
        <option value="1900,1100">1900x1100</option>
      </select>
    </div>
  );
};

export default SettingBar;
