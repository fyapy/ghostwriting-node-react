import React, { Component } from "react";
import { Link } from "react-router-dom";
import isEmpty from "./../../validation/is-empty";

// Components
import Message from "./Message";

class Dialog extends Component {
  state = {
    message: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submit = e => {
    e.preventDefault();
    if (!isEmpty(this.state.message)) {
      this.props.sendMessage(this.state.message);
      this.setState({ message: "" });
    }
  };

  componentDidMount() {
    if (isEmpty(this.props.target)) {
      this.props.findTarget();
    }
  }

  render() {
    const dialog = this.props.dialog;
    const user = this.props.target;
    const auth = this.props.me;

    return (
      <div className="dialog">
        <div className="dialog-user">
          <div className="dialog-user-name">
            <Link to={user ? `/user/${user.id}` : "/users"} className="link">
              {user ? user.username : "Имя"}
            </Link>
            <span className="dialog-user-online">online</span>
            {user && user.id !== auth.id ? (
              <Link
                to={`/contract?user=${user ? user.id : ""}`}
                className="dialog-choose-worker"
              >
                <i className="fas fa-dice-d10" /> Выбрать
              </Link>
            ) : (
              ""
            )}
          </div>
          <div className="dialog-user-avatar">
            <Link to={user ? `/user/${user.id}` : "/users"}>
              <img
                src={`/img/${user ? user.avatar : "04.png"}`}
                alt={user ? user.username : "Имя"}
              />
            </Link>
          </div>
        </div>
        <div className="dialog-list">
          {dialog.length > 0 ? (
            dialog
              .slice()
              .reverse()
              .map(message => (
                <Message
                  key={message.id}
                  me={auth}
                  target={user}
                  message={message}
                />
              ))
          ) : (
            <div className="dialog-empty">
              У вас нет сообщений с этим пользователем...
            </div>
          )}
        </div>
        <form className="dialog-form" onSubmit={this.submit}>
          <textarea
            name="message"
            className="dialog-form-text"
            placeholder="Напишите сообщение..."
            onChange={this.onChange}
            value={this.state.message}
          />
          <button type="submit" className="dialog-form-btn">
            <i className="fas fa-paper-plane" />
          </button>
        </form>
      </div>
    );
  }
}

export default Dialog;
