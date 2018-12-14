import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class AdminPanel extends Component {
  state = {};

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      if (ret !== "admin") {
        document.getElementById("main").textContent = "Acess Denied(Not admin)";
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="main">
          <Link to="/createQuiz">
            <button>Create Quiz</button>
          </Link>
          <Link to="/createQuestion">
            <button>Create Question</button>
          </Link>
          <Link to="/editQuiz">
            <button>Edit quiz</button>
          </Link>
          <Link to="/viewUsers">
            <button>View Users</button>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminPanel;
