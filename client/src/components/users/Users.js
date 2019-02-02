import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getAllUsers, getMoreUsers } from "./../../actions/usersActions";

class Users extends Component {
  constructor() {
    super();
    this.usersRef = React.createRef();
  }

  componentDidMount() {
    this.props.getAllUsers();
  }

  loadMore = e => {
    const el = this.usersRef.current,
      topOffset = el.scrollTop,
      scrollHeight = el.scrollHeight,
      clientHeight = el.clientHeight;

    if (
      scrollHeight <= topOffset + clientHeight + 100 &&
      this.props.users.loadingList &&
      !this.props.users.no_more
    ) {
      this.props.getMoreUsers(this.props.users.next_page);
    }
  };

  render() {
    const users = this.props.users.users;
    return (
      <div className="users" onScroll={this.loadMore} ref={this.usersRef}>
        <div className="users-list">
          <h2 className="users-title">Список пользователей</h2>
          {users.length > 0
            ? users.map(user => (
                <Link
                  to={`/user/${user.id}`}
                  className="users-item"
                  key={user.id}
                >
                  <div className="users-avatar">
                    <img src={`/img/${user.avatar}`} alt={user.username} />
                  </div>
                  <div className="users-wrapper">
                    <div className="users-info">
                      <div className="users-name">{user.username}</div>
                      <div className="users-description">
                        {user.description !== null
                          ? user.description
                          : "Описание пустое.."}
                      </div>
                    </div>
                    <div className="users-stats">
                      <div className="users-likes">
                        <i className="far fa-thumbs-up" /> {user.likes}
                      </div>
                      <div className="users-dislikes">
                        <i className="far fa-thumbs-down" /> {user.dislikes}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : ""}
          {this.props.users.loadingList === false ? (
            <div className="lds-dual-ring" />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { getAllUsers, getMoreUsers }
)(Users);
