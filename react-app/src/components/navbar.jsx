import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Navbar extends Component {
  state = {};
  render() {
    return (
      <nav class="navbar navbar-light bg-light">
        <div>
          QUIZGAME!
          <Link to="/register">
            <button>Register</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/logout">
            <button>Logout</button>
          </Link>
          <Link to="/adminPanel">
            <button>Admin Panel</button>
          </Link>
          <Link to="/listQuizzes">
            <button>List of Quizzes</button>
          </Link>
          <Link to="/leaderboard">
            <button>Leaderboard</button>
          </Link>
        </div>
      </nav>
    );
  }
}

export default Navbar;
