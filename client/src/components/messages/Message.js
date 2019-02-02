import React, { Component } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment/locale/ru";

class Message extends Component {
  render() {
    const me = this.props.me;
    const message = this.props.message;
    const user = this.props.target
      ? this.props.target
      : { id: "", username: "Имя", avatar: "04.png" };

    return (
      <div>
        <div
          className={`dialog-message ${me.id === message.fromId ? "me" : ""}`}
        >
          <Link
            to={`/user/${me.id === message.fromId ? me.id : user.id}`}
            className="dialog-message-avatar"
          >
            <img
              src={`/img/${me.id === message.fromId ? me.avatar : user.avatar}`}
              alt={me.id === message.fromId ? me.name : user.username}
            />
          </Link>
          <div className="dialog-message-data">
            <div className="dialog-message-name">
              {me.id === message.fromId ? me.name : user.username}
            </div>
            <Moment className="dialog-message-date" locale="ru" fromNow>
              {message.createdAt}
            </Moment>
            {message.readed === null ? <span className="unreaded" /> : ""}
            <div className="dialog-message-text">
              {message.text.replace(/<\/br>/g, " \n ")}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Message;
