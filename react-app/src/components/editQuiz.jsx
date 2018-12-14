import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class ListQuizzes extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  genreHandler = (e, g) => {
    var genre = "";
    console.log("gtefv");
    switch (g) {
      case 1:
        genre = "All";
        break;
      case 2:
        genre = "Comics";
        break;
      case 3:
        genre = "Sports";
        break;
      case 4:
        genre = "History";
        break;
      case 5:
        genre = "Other";
        break;
    }
    console.log(genre);
    const request = new Request("http://127.0.0.1:8080/indexer/" + genre);
    fetch(request).then(response => {
      response.json().then(data => {
        this.setState({ data });
      });
    });
  };

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      this.genreHandler(null, 1);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="main">
          List of Quizzes:
          <br />
          <button onClick={e => this.genreHandler(e, 1)}>All</button>
          <button onClick={e => this.genreHandler(e, 2)}>Comics</button>
          <button onClick={e => this.genreHandler(e, 3)}>Sports</button>
          <button onClick={e => this.genreHandler(e, 4)}>History</button>
          <button onClick={e => this.genreHandler(e, 5)}>Other</button>
          <ul type="1">
            {this.state.data !== undefined
              ? this.state.data.map(function(value, key) {
                  return (
                    <li>
                      <Link to={"/edit/" + value.name}>{value.name}</Link>
                      <br />
                    </li>
                  );
                })
              : function() {
                  return;
                }}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default ListQuizzes;
