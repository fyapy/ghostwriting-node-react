import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPostById } from "../../actions/postActions";
import Moment from "react-moment";
import "moment/locale/ru";

class Post extends Component {
  state = {
    loading: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.post == null) {
      this.setState({ loading: true });
    }
  }

  componentDidMount() {
    this.props.getPostById(this.props.match.params.id);
  }

  render() {
    const { post } = this.props.posts;
    const { isAuthenticated } = this.props.auth;
    const urlId = this.props.match.params.id;

    return (
      <div className="post">
        {!this.state.loading ? <div className="lds-dual-ring" /> : ""}
        {post != null && parseInt(post.id) === parseInt(urlId) ? (
          <div className="post-topline">
            <div className="post-title">{post.title}</div>
            <div className="post-avatar">
              <img src={`/img/${post.userAvatar}`} alt={post.userName} />
            </div>
            <div className="post-stats">
              <div className="post-stats-name">{post.userName}</div>
              <div className="post-stats-like">
                <i className="far fa-thumbs-up" /> {post.userLikes}
              </div>
              <div className="post-stats-dislike">
                <i className="far fa-thumbs-down" /> {post.userDislikes}
              </div>
            </div>
            <div className="post-budget">
              <div className="post-budget-title">Бюджет:</div>
              <div className="post-budget-price">
                {post.completed !== null ? (
                  "Исполнитель оперделён"
                ) : post.budget === 0 || post.budget === null ? (
                  <span>По договоренности</span>
                ) : (
                  <span>
                    {post.budget} <i className="far fa-ruble-sign" />
                  </span>
                )}
              </div>
            </div>
            <div className="post-text">{post.text}</div>
            <Moment className="post-date" locale="ru" fromNow>
              {post.createdAt}
            </Moment>
            <div className="post-views">
              <i className="far fa-eye" /> {post.views}
            </div>
            {post.completed === null ? (
              <div className="post-bottomline">
                <Link
                  to={
                    isAuthenticated
                      ? `/messages?to=${post.userId}&post=${post.id}`
                      : "/login"
                  }
                  className="post-bottomline-send button"
                >
                  Отправить сообщение
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPostById }
)(Post);
