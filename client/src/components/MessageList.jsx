import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages }) => {
  return (
    <div className="messages">
      {messages.map((mess) => (
        <div key={mess.id}>
          {mess.event === "connection" ? (
            <div className="connection_message">
              Пользователь {mess.username} подключился
            </div>
          ) : (
            <MessageItem mess={mess} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
