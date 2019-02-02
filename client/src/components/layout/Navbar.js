import React, { Component } from "react";
import uuid from "uuid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getCurrentProfile } from "../../actions/profileActions";
import {
  clearMessage,
  addSendedMessage,
  addNewMessage,
  readMessages,
  setUnreaded
} from "../../actions/messageAction";

import socket from "./../../socket";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  menuToggle = e => {
    this.props.menuToggle();
  };

  componentDidMount() {
    let aud = new Audio("/noty.mp3");
    aud.volume = 0.5;

    if (this.props.auth.isAuthenticated) {
      // If authenticated set user on Socket
      socket.emit("setUser", { token: localStorage.jwtToken });
      this.props.getCurrentProfile();
      socket.emit("getUnreaded", { user: this.props.auth.user.id });
    }

    // Socket event - Listen receive new messages
    socket.on("receivingMessage", data => {
      // Add new message
      this.props.addNewMessage(
        data,
        this.props.messages.previews,
        this.props.messages.dialogTarget,
        this.props.messages.dialog
      );
      if (data.from === this.props.messages.dialogTarget) {
        // Socket event - Send messages read
        socket.emit(`messageRead`, {
          to: data.from,
          from: this.props.auth.user.id
        });
        // Update messgaes in the read
        this.props.readMessages(
          data.from,
          this.props.messages.previews,
          this.props.messages.dialogTarget,
          this.props.messages.dialog
        );
      } else {
        aud.play();
        toast(
          `Новое сообщение: ${
            data.text.length > 34
              ? data.text
                  .replace(/<\/br>/g, " ")
                  .substring(0, 34)
                  .trim() + "..."
              : data.text
          }`,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000
          }
        );
        // Unread messages count get
        socket.emit("getUnreaded", { user: this.props.auth.user.id });
      }
    });

    // Socket event - Notify what user read my messages
    socket.on(`messagesReaded`, data => {
      // Update messgaes in the read
      this.props.readMessages(
        data.from,
        this.props.messages.previews,
        this.props.messages.dialogTarget,
        this.props.messages.dialog
      );
    });

    socket.on("setUnreaded", data => {
      if (data.user === this.props.auth.user.id) {
        this.props.setUnreaded(data);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated !== this.props.auth.isAuthenticated) {
      if (nextProps.auth.isAuthenticated) {
        // If authenticated set user on Socket
        socket.emit("setUser", { token: localStorage.jwtToken });
        this.props.getCurrentProfile();
        socket.emit("getUnreaded", { user: nextProps.auth.user.id });
      } else {
        this.props.setUnreaded({ unreaded: 0 });
      }
    }
    // If we write new message
    if (nextProps.messages.message) {
      const message = nextProps.messages.message;
      // Emit Socket - send written message
      socket.emit("sendMessage", {
        text: message.message,
        to: message.to,
        post: message.post
      });
      // Add your message to us store
      this.props.addSendedMessage(
        {
          id: uuid.v4(),
          text: message.message,
          from: this.props.auth.user.id,
          to: message.to
        },
        this.props.messages.previews,
        this.props.messages.dialogTarget,
        this.props.messages.dialog
      );
      // Clear message textarea value
      this.props.clearMessage();
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { profile } = this.props.profile;
    const isOpen = this.props.isOpen;

    const authLinks = (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/balance" className="nav-link smaller">
            <i className="fal fa-dollar-sign" />
            Баланс
          </Link>
        </li>
        {profile ? (
          <li className="nav-item">
            <Link to="/profile" className="nav-link smaller nav-avatar">
              <span>
                <img
                  src={`/img/${profile ? profile.avatar : ""}`}
                  alt={profile ? profile.name : ""}
                />
              </span>
              {profile ? profile.name : ""}
            </Link>
          </li>
        ) : (
          ""
        )}
        <li className="nav-item indent">
          <a
            href="/logout"
            onClick={this.props.onLogoutClick}
            className="nav-link smaller"
          >
            <i className="fal fa-sign-out" />
            Выйти
          </a>
        </li>
      </React.Fragment>
    );

    const guestLinks = (
      <React.Fragment>
        <li className="nav-item">
          <Link to="/login" className="nav-link smaller">
            <i className="fal fa-sign-in" />
            Войти
          </Link>
        </li>
        <li className="nav-item indent">
          <Link to="/register" className="nav-link smaller">
            <i className="fal fa-user-plus" />
            Регистрация
          </Link>
        </li>
      </React.Fragment>
    );

    return (
      <nav className={`nav ${isOpen ? "opened" : "closed"}`}>
        <span onClick={this.menuToggle} className="nav-toggle">
          <div
            className={`hamburger hamburger--collapse ${
              isOpen ? "is-active" : ""
            }`}
          >
            <div className="hamburger-box">
              <div className="hamburger-inner" />
            </div>
          </div>
        </span>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link nav-logo">
              G<span>host</span>W<span>riting</span>
            </Link>
          </li>

          {isAuthenticated ? authLinks : guestLinks}

          <li className="nav-item">
            <Link to="/posts" className="nav-link smaller">
              <i className="fal fa-pen-alt" />
              Работа
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className="nav-link smaller">
              {this.props.messages.unreaded_count > 0 ? (
                <span className="nav-unreaded">
                  {this.props.messages.unreaded_count}
                </span>
              ) : (
                ""
              )}
              <i className="fal fa-comments" />
              Сообщения
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/deals" className="nav-link smaller">
              <i className="fal fa-handshake" />
              Сделки
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/users" className="nav-link smaller">
              <i className="fal fa-users" />
              Пользователи
            </Link>
          </li>
          <li className="nav-item dev">
            <a
              href="https://vk.com"
              rel="noopener noreferrer"
              className="nav-link smaller"
              target="_blank"
            >
              <i className="fas fa-code" /> Developed by <b>Amir</b>
            </a>
          </li>
          <li className="nav-item vk">
            <a
              href="https://google.com"
              rel="noopener noreferrer"
              className="nav-link smaller"
              target="_blank"
            >
              <i className="fab fa-vk" />
              Мы Вконтакте
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  messages: state.messages
});

export default connect(
  mapStateToProps,
  {
    logoutUser,
    getCurrentProfile,
    clearMessage,
    addSendedMessage,
    addNewMessage,
    readMessages,
    setUnreaded
  }
)(Navbar);
