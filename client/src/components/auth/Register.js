import React, { Component } from "react";
import propTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/messages");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="form">
          <h1 className="form-title">Регистрация</h1>
          <form className="form-body" noValidate onSubmit={this.onSubmit}>
            <div className="form-group">
              <span className="form-subtitle">Логин:</span>
              <input
                type="text"
                name="name"
                className={classnames("form-control", {
                  "is-invalid": errors.name
                })}
                value={this.state.name}
                placeholder="Логин.."
                onChange={this.onChange}
              />
              {errors.name && <div className="form-invalid">{errors.name}</div>}
            </div>

            <div className="form-group">
              <span className="form-subtitle">Email:</span>
              <input
                type="email"
                name="email"
                className={classnames("form-control", {
                  "is-invalid": errors.email
                })}
                value={this.state.email}
                placeholder="Email.."
                onChange={this.onChange}
              />
              {errors.email && (
                <div className="form-invalid">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <span className="form-subtitle">Пароль:</span>
              <input
                type="password"
                name="password"
                className={classnames("form-control", {
                  "is-invalid": errors.password
                })}
                value={this.state.password}
                placeholder="Пароль.."
                onChange={this.onChange}
              />
              {errors.password && (
                <div className="form-invalid">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <span className="form-subtitle">Повторите пароль:</span>
              <input
                type="password"
                name="password2"
                className={classnames("form-control", {
                  "is-invalid": errors.password2
                })}
                value={this.state.password2}
                placeholder="Повторите пароль.."
                onChange={this.onChange}
              />
              {errors.password2 && (
                <div className="form-invalid">{errors.password2}</div>
              )}
            </div>

            <div className="form-group">
              <div className="form-helper">
                Или <Link to="/login">авторизируетесь</Link>
              </div>
            </div>

            <div className="form-group">
              <input
                className="form-submit button"
                type="submit"
                value="Отправить"
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  errors: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
