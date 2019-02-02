import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import queryString from "query-string";
import { toast } from "react-toastify";
import { loginUser } from "../../actions/authActions";
import { Link } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/messages");
    }

    const urlQuery = queryString.parse(this.props.location.search);
    if (urlQuery.unauthorized !== undefined) {
      let aud = new Audio("/noty.mp3");
      aud.volume = 0.5;
      aud.play();

      toast.error(`Вы не авторизованы`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/messages");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="form">
        <h1 className="form-title">Логин</h1>
        <form className="form-body" noValidate onSubmit={this.onSubmit}>
          <div className="form-group">
            <span className="form-subtitle">Email:</span>
            <input
              type="email"
              name="email"
              className={classnames("form-control", {
                "is-invalid": errors.email
              })}
              value={this.state.email}
              placeholder="Email"
              onChange={this.onChange}
            />
            {errors.email && <div className="form-invalid">{errors.email}</div>}
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
              placeholder="Password"
              onChange={this.onChange}
            />
            {errors.password && (
              <div className="form-invalid">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <div className="form-helper">
              Если вы не <Link to="/register">зарегистрированы</Link>
            </div>
          </div>

          <div className="form-group">
            <input className="form-submit button" type="submit" value="Войти" />
          </div>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
