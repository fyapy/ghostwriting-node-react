import React, { Component } from "react";
import propTypes from "prop-types";
import { withRouter } from "react-router-dom";
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
        <h1>Register</h1>
        <form noValidate onSubmit={this.onSubmit}>
          <input
            type="text"
            name="name"
            className={classnames("form-control", {
              "is-invalid": errors.name
            })}
            value={this.state.name}
            placeholder="Name"
            onChange={this.onChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          <br />
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
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
          <br />
          <input
            type="text"
            name="password"
            className={classnames("form-control", {
              "is-invalid": errors.password
            })}
            value={this.state.password}
            placeholder="Password"
            onChange={this.onChange}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
          <br />
          <input
            type="text"
            name="password2"
            className={classnames("form-control", {
              "is-invalid": errors.password2
            })}
            value={this.state.password2}
            placeholder="Confirm Password"
            onChange={this.onChange}
          />
          {errors.password2 && (
            <div className="invalid-feedback">{errors.password2}</div>
          )}
          <br />
          <input type="submit" value="submit" />
        </form>
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
