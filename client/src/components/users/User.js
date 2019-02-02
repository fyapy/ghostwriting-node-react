import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserById } from "../../actions/usersActions";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment/locale/ru";

class User extends Component {
  componentDidMount() {
    this.props.getUserById(this.props.match.params.id);
  }

  render() {
    const user = this.props.users.user;

    return (
      <div className="user">
        {user === null ? (
          <div className="lds-dual-ring" />
        ) : (
          <div className="user-item">
            <Link to={`/messages?to=${user.id}`} className="user-avatar">
              <img src={`/img/${user.avatar}`} alt={user.username} />
            </Link>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-date">
                Аккаунт создан{" "}
                <Moment locale="ru" fromNow>
                  {user.createdAt}
                </Moment>
              </div>
              <div className="user-marks">
                <div className="user-likes">
                  <i className="far fa-thumbs-up" /> {user.likes}
                </div>
                <div className="user-dislikes">
                  <i className="far fa-thumbs-down" /> {user.dislikes}
                </div>
              </div>
              <div className="user-description-title">О себе:</div>
              <div className="user-description">
                {user.description !== null
                  ? user.description
                  : "Описание пустое.."}
              </div>
              <div className="user-btn">
                <Link to={`/messages?to=${user.id}`} className="button">
                  Перейти к диалогу
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { getUserById }
)(User);
