import React, { Component } from "react";
import Navbar from "./navbar";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleUsernameChange = e => {
    const username = e.target.value;
    this.setState({ username });
  };

  handlePasswordChange = e => {
    const password = e.target.value;
    this.setState({ password });
  };

  handleSubmit = e => {
    e.preventDefault();
    var loginData = {
      username: this.state.username,
      password: this.state.password
    };
    fetch("http://127.0.0.1:8080/login", {
      method: "POST",
      body: JSON.stringify(loginData)
    }).then(response => {
      if (response.status === 404) {
        document.getElementById("loginMessage").textContent =
          "Incorrect Username or Password";
      } else if (response.status === 200) {
        response.json().then(data => {
          localStorage.setItem("username", data.username);
        });
        document.getElementById("loginMessage").textContent =
          "Login Successful!";
      }
    });
  };

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret !== null) {
      document.getElementById("main").textContent = "Already Logged In!";
      setTimeout(function() {
        window.location.href = "/";
      }, 1500);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="main">
          <br />
          <br />
          <br />
          <form onSubmit={e => this.handleSubmit(e)}>
            Username:{" "}
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={e => this.handleUsernameChange(e)}
            />
            <br />
            Password:{" "}
            <input
              type="password"
              name="password"
              value={this.state.password}
              onChange={e => this.handlePasswordChange(e)}
            />
            <br />
            <button type="submit">Login</button>
          </form>
          <br />
          <div id="loginMessage"> </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
