import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import { createPost } from "../../actions/postActions";

class PostCreate extends Component {
  state = {
    title: "",
    text: "",
    budget: "",
    errors: {},
    disable: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  disableHanle = e => {
    this.setState({ disable: !this.state.disable });
  };

  onSubmit = e => {
    e.preventDefault();
    const newPost = {
      title: this.state.title,
      text: this.state.text,
      budget: this.state.disable ? null : this.state.budget
    };
    this.props.createPost(newPost, this.props.history);
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { errors } = this.state;

    const warning = (
      <div className="form-warning">
        Заказ не будет добавлен пока вы не{" "}
        <Link to="/register">зарегистрируетесь!</Link>
      </div>
    );

    return (
      <div className="create">
        <div className="form">
          <h1 className="form-title fw600">Добавление заказа</h1>
          {isAuthenticated ? "" : warning}
          <form className="form-body" noValidate onSubmit={this.onSubmit}>
            <div className="form-group">
              <span className="form-subtitle">Название проекта:</span>
              <input
                type="text"
                name="title"
                className={classnames("form-control", {
                  "is-invalid": errors.title
                })}
                value={this.state.title}
                placeholder="Что вам нужно и кого вы ищете..."
                onChange={this.onChange}
              />
              {errors.title && (
                <div className="form-invalid">{errors.title}</div>
              )}
            </div>

            <div className="form-group">
              <span className="form-subtitle">Подробно опишите задание:</span>
              <textarea
                name="text"
                className={classnames("form-control", {
                  "is-invalid": errors.text
                })}
                onChange={this.onChange}
                value={this.state.text}
                placeholder="Напишите какой результат вы хотите получить, сроки и др.
                условия..."
              />
              {errors.text && <div className="form-invalid">{errors.text}</div>}
            </div>

            <div className="form-group fdr">
              <span className="form-subtitle">Бюджет:</span>
              <input
                type="text"
                name="budget"
                className={classnames("form-control create-budget", {
                  "is-invalid": errors.budget
                })}
                value={this.state.budget}
                placeholder="0"
                onChange={this.onChange}
                disabled={this.state.disable}
              />
              <span className="create-or">Или</span>
              <label htmlFor="cbx" className="create-check">
                <input id="cbx" type="checkbox" onChange={this.disableHanle} />
                <span>По договоренности</span>
              </label>
              {errors.budget && (
                <div className="form-invalid">{errors.budget}</div>
              )}
            </div>

            <div className="form-group">
              <input
                className="form-submit button"
                type="submit"
                value="Создать"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createPost }
)(withRouter(PostCreate));
