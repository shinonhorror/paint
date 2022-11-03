import React from "react";

const MessageItem = (props) => {
  return (
    <div className="message">
      <div>
        {props.mess.username} at {props.mess.date}
      </div>
      <div>{props.mess.message}</div>
    </div>
  );
};

export default MessageItem;
