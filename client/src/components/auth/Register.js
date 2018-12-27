import React, { Component } from "react";

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

    console.log(newUser);
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="name"
            value={this.state.name}
            placeholder="Name"
            onChange={this.onChange}
          />
          <br />
          <input
            type="email"
            name="email"
            value={this.state.email}
            placeholder="Email"
            onChange={this.onChange}
          />
          <br />
          <input
            type="text"
            name="password"
            value={this.state.password}
            placeholder="Password"
            onChange={this.onChange}
          />
          <br />
          <input
            type="text"
            name="password2"
            value={this.state.password2}
            placeholder="Confirm Password"
            onChange={this.onChange}
          />
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default Register;
