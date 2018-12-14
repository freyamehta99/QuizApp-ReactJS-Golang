import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Side extends Component {
  state = {
    loggedin: ""
  };

  check = () => {
    const request = new Request("http://127.0.0.1:8080/isLoggedIn");
    fetch(request).then(response => {
      if (response.status == 404) {
        this.state.loggedin = "";
      } else {
        response.json().then(data => {
          this.state.loggedin = data;
          console.log(this.state.loggedin);
        });
      }
    });
  };

  render() {
    this.check();
    return (
      <React.Fragment>
        {this.state.loggedin !== "" ? (
          <p>
            {this.state.loggedin}
            <Link to="/logout">
              <button type="submit">Logout</button>
            </Link>
          </p>
        ) : (
          <Link to={"/login"}>
            <button type="submit">Login</button>
          </Link>
        )}
      </React.Fragment>
    );
  }
}

export default Side;
