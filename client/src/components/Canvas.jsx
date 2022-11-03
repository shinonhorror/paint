import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import "../styles/canvas.scss";
import Rect from "../tools/Rect";
import Circle from "../tools/Cirlce";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import axios from "axios";


const Canvas = observer(() => {
  const canvasRef = useRef();
  const uid = JSON.parse(localStorage.getItem("id"));
  const autoUpdateImage = () => {
    canvasState.setCanvas(canvasRef.current);

    let ctx = canvasRef.current.getContext("2d");
    axios.get(`http://localhost:5000/image?id=${uid}`).then((response) => {
      const img = new Image();
      img.src = response.data;
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      };
    });
  };

  useEffect(() => {
    autoUpdateImage();
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(uid);
      toolState.setTool(new Brush(canvasRef.current, socket, uid));
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: uid,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (e) => {
        let msg = JSON.parse(e.data);
        switch (msg.method) {
          case "connection":
            console.log(`Подключен пользователь ${msg.username}`);
            break;
          case "draw":
            drawHandler(msg);
            break;
          case "message":
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y, figure.lineWidth, figure.color);
        break;
      case "rect":
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color
        );
        break;
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color);
        break;
      case "line":
        Line.staticDraw(ctx, figure.x, figure.y, figure.endX, figure.endY);
        break;
      case "eraser":
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth);
        break;
      case "undo":
        canvasState.undo();
        break;
      case "size":
        canvasState.setCanvasWidth(figure.w);
        canvasState.setCanvasHeight(figure.h);
        autoUpdateImage();
        break;
      case "finish":
        ctx.beginPath();
        break;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
    axios.post(`http://localhost:5000/image?id=${uid}`, {
      img: canvasRef.current.toDataURL(),
    });
  };

  return (
    <div className="canvas">
      <canvas
        onMouseDown={() => mouseDownHandler()}
        ref={canvasRef}
        width={600}
        height={400}
      ></canvas>
    </div>
  );
});

export default Canvas;
