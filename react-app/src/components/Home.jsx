import React, { Component } from "react";

class Home extends Component {
  state = {};

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="main">Home</div>
      </React.Fragment>
    );
  }
}

export default Home;
