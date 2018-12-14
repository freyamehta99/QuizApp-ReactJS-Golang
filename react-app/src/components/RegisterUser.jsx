import React, { Component } from "react";
import Navbar from "./navbar";

class Register extends Component {
  state = {
    username: "",
    password: "",
    canBeRegistered: false
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
    const nameToBePassed = this.state.username;
    const request = new Request(
      "http://127.0.0.1:8080/users/" + nameToBePassed
    );
    fetch(request)
      .then(response => {
        if (response.status === 404) {
          this.state.canBeRegistered = true;
        }
      })
      .then(response => {
        if (this.state.canBeRegistered === true) {
          {
            this.state.canBeRegistered = false;
          }
          var registrationData = {
            username: this.state.username,
            password: this.state.password
          };
          fetch("http://127.0.0.1:8080/register", {
            method: "POST",
            body: JSON.stringify(registrationData)
          }).then(response => {
            if (response.status === 200) {
              document.getElementById("message").textContent = "New User Added";
            } else {
              document.getElementById("message").textContent =
                "empty username/password not allowed";
            }
          });
        } else {
          document.getElementById("message").textContent =
            "Username already taken";
        }
      });
  };

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
            <button type="submit">Register</button>
          </form>
          <br />
          <div id="message"> </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Register;
