import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getAllPosts, getMorePosts } from "../../actions/postActions";
import Moment from "react-moment";
import "moment/locale/ru";

class Posts extends Component {
  constructor() {
    super();
    this.postsRef = React.createRef();
  }

  componentDidMount() {
    this.props.getAllPosts();
  }

  loadMore = e => {
    const el = this.postsRef.current,
      topOffset = el.scrollTop,
      scrollHeight = el.scrollHeight,
      clientHeight = el.clientHeight;

    if (
      scrollHeight <= topOffset + clientHeight + 100 &&
      this.props.posts.loading_posts &&
      !this.props.posts.no_more
    ) {
      this.props.getMorePosts(this.props.posts.next_page);
    }
  };

  render() {
    const posts = this.props.posts.posts;

    const noMore = (
      <div className="posts-nomore">
        <h2>Больше нету...</h2>
      </div>
    );

    const budget = (budget, worker) => {
      if (worker) {
        return "Исполнитель оперделён";
      } else {
        if (budget) {
          return (
            <span>
              {budget} <i className="far fa-ruble-sign" />
            </span>
          );
        } else {
          return "По договорённости";
        }
      }
    };

    return (
      <div className="posts" onScroll={this.loadMore} ref={this.postsRef}>
        <h1 className="posts-title">
          Здесь находится список всех заказов.{" "}
          <Link to="/posts/create" className="button posts-add">
            <i className="far fa-plus" /> Добавить
          </Link>
        </h1>
        {posts.map(post => (
          <Link to={`/post/${post.id}`} key={post.id} className="posts-item">
            <span className="posts-item-img">
              <img
                src={`/img/${
                  post.userAvatar !== undefined ? post.userAvatar : "none"
                }`}
                alt={post.userUsername}
              />
            </span>
            <span className="posts-item-body">
              <span className="posts-item-title">
                {post.title.slice(0, 100)}
              </span>
              <span className="posts-item-budget">
                {budget(post.budget, post.workerId)}
              </span>
              <span className="posts-item-text">{post.text}</span>
              <Moment className="posts-item-date" locale="ru" fromNow>
                {post.createdAt}
              </Moment>
              <span className="posts-item-metadata">
                <i className="far fa-eye" /> {post.views}
                <i className="far fa-comment" /> {post.messages}
              </span>
            </span>
          </Link>
        ))}
        {this.props.posts.loading_posts === false ? (
          <div className="lds-dual-ring" />
        ) : (
          ""
        )}
        {this.props.posts.no_more ? noMore : ""}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts
});

export default connect(
  mapStateToProps,
  { getAllPosts, getMorePosts }
)(Posts);
