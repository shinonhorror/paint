import React from "react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../styles/canvas.scss";
import Rect from "../tools/Rect";
import Circle from "../tools/Cirlce";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import axios from "axios";

const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    let ctx = canvasRef.current.getContext("2d");
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((response) => {
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      });
  }, []);

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      // socket.close = () => {
      //   socket.send(
      //     JSON.stringify({
      //       id: params.id,
      //       username: canvasState.username,
      //       method: "disconnection",
      //     })
      //   );
      // };
      socket.onmessage = (e) => {
        let msg = JSON.parse(e.data);
        switch (msg.method) {
          case "connection":
            console.log(`Подключен пользователь ${msg.username}`);
            break;
          case "disconnection":
            console.log(`Отключен пользователь ${msg.username}`);
            break;
          case "draw":
            drawHandler(msg);
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
      case "finish":
        ctx.beginPath();
        break;
    }
  };

  const mouseDownHandler = () => {
    axios.post(`http://localhost:5000/image?id=${params.id}`, {
      img: canvasRef.current.toDataURL(),
    });
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };

  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>Введите ваше имя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => connectionHandler()}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
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