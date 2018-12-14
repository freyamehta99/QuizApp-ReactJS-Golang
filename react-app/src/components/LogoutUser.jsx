import React, { Component } from "react";

class Logout extends Component {
  state = {};

  componentDidMount = () => {
    var ret = localStorage.getItem("username");
    if (ret == null) {
      document.getElementById("msg").textContent = "First Login Please";
    } else {
      localStorage.removeItem("username");
      document.getElementById("msg").textContent = "Logged Out Successfully!";
    }
    setTimeout(function() {
      window.location.href = "/login";
    }, 1500);
  };

  render() {
    return <div id="msg"> </div>;
  }
}

export default Logout;
