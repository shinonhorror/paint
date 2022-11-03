import React, { useEffect, useState, useRef } from "react";
import MessageList from "./MessageList";
import canvasState from "../store/canvasState";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const scrollTarget = useRef();

  function connect() {
    //   socket.current = new WebSocket("ws://localhost:5000");

    //   socket.current.onopen = () => {
    //     setConnected(true);
    //     const message = {
    //       event: "connection",
    //       id: Date.now(),
    //       username,
    //     };

    //     socket.current.send(JSON.stringify(message));
    //   };
    //   socket.current.onmessage = (event) => {
    //     const message = JSON.parse(event.data);
    //     setMessages((prev) => [...prev, message]);
    //   };

    //   socket.current.onclose = () => {
    //     console.log("Socket закрыт");
    //   };
    //   socket.current.onerror = () => {
    //     console.log("Socket произошла ошибка");
    //   };
    // }

    useEffect(() => {
      if (scrollTarget.current) {
        scrollTarget.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages.length]);

    const sendMessage = async () => {
      const username = canvasState.username;
      const message = {
        username,
        message: value,
        date: new Date().toLocaleTimeString().slice(0, -3),
        id: Date.now(),
        method: "message",
      };
      canvasState.socket.send(JSON.stringify(message));
      setValue("");
    };

    return (
      <div className="center">
        <div>
          <MessageList messages={messages} />
          <div ref={scrollTarget}></div>
          <div className="form">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="text"
              placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    );
  }
};
export default Chat;
