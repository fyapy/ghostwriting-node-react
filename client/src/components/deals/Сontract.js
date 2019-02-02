import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import classnames from "classnames";
import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import {
  getMyPosts,
  setMyDealPost,
  setExecutor
} from "../../actions/postActions";
import Moment from "react-moment";
import "moment/locale/ru";

class Сontract extends Component {
  state = {
    range: 0
  };

  componentDidMount() {
    this.props.getMyPosts();
  }

  setDealPost = id => {
    this.props.setMyDealPost(id);
  };

  setExecutor = () => {
    if (this.props.posts.my_deal_post !== null) {
      const deal_data = {
        post: this.props.posts.my_deal_post,
        executor: this.props.messages.dialogTarget,
        amount: this.state.range
      };

      this.props.setExecutor(deal_data, this.props.history);
    }
  };

  handleRange = val => {
    this.setState({ range: parseInt(val) });
  };

  render() {
    const messages = this.props.messages;
    const posts = this.props.posts;
    const user = messages.targets.find(x => x.id === messages.dialogTarget);
    const profile = this.props.profile.profile;

    return (
      <div className="contract">
        {messages.dialogTarget !== null ? (
          <div className="contract-body">
            {posts.my_posts === null ? (
              <div className="messages-preview-loader">
                <div className="lds-dual-ring" />
              </div>
            ) : (
              <div className="contract-content">
                <div className="contract-posts">
                  <div className="contract-title">
                    Выберите пост для которого вы хотите назначить исполнителя:
                  </div>
                  {posts.my_posts.length > 0
                    ? posts.my_posts.map(post => (
                        <div
                          className={classnames("contract-posts-item", {
                            active: post.id === posts.my_deal_post
                          })}
                          onClick={() => this.setDealPost(post.id)}
                          key={post.id}
                        >
                          <div className="contract-posts-title">
                            {post.title}
                          </div>
                          <div className="contract-posts-text">{post.text}</div>
                          <Moment
                            className="contract-posts-date"
                            locale="ru"
                            fromNow
                          >
                            {post.createdAt}
                          </Moment>
                        </div>
                      ))
                    : "У вас нету постов без исполнителя"}
                </div>
                <div className="contract-user">
                  <div className="contract-title">Выбранный кандидат:</div>
                  <div className="contract-user-avatar">
                    <img src={`/img/${user.avatar}`} alt={user.username} />
                  </div>
                  <div className="contract-user-username">{user.username}</div>
                  <div className="contract-user-rating">
                    <div className="contract-user-likes">
                      <i className="far fa-thumbs-up" /> {user.likes}
                    </div>
                    <div className="contract-user-dislikes">
                      <i className="far fa-thumbs-down" /> {user.dislikes}
                    </div>
                  </div>
                  <div className="contract-user-description">
                    {user.description === null
                      ? "Описание пустое"
                      : user.description}
                  </div>
                  <div
                    className={classnames("contract-user-btn", {
                      active: posts.my_deal_post !== null
                    })}
                  >
                    <div className="contract-range">
                      <div className="contract-range-title">
                        Сумма безопасной сделки:{" "}
                        <span>
                          {this.state.range} <i className="far fa-ruble-sign" />
                          {profile.balance === 0
                            ? " (Баланс пуст)"
                            : this.state.range === 0
                            ? " (Не активна)"
                            : ""}
                        </span>
                      </div>
                      <Range
                        min={0}
                        max={profile.balance}
                        onChange={this.handleRange}
                        defaultValue={[0]}
                      />
                    </div>
                    <div className="button" onClick={this.setExecutor}>
                      Сделать исполнителем
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="contract-empty">
            Исполнитель не выбран, выберите <Link to="/messages">его</Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.messages,
  posts: state.posts,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getMyPosts, setMyDealPost, setExecutor }
)(withRouter(Сontract));
