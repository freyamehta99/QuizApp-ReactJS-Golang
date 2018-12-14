import React, { Component } from "react";

class Leaderboard extends Component {
  state = {
    user: "",
    scores: [],
    board: []
  };

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      this.setState({ user: ret });
      fetch(new Request("http://127.0.0.1:8080/scores/" + ret)).then(
        response => {
          console.log(response);
          if (response.status === 404) {
            document.getElementById("msg").innerHTML = "Invalid Username";
          } else {
            response.json().then(data => {
              this.setState({ scores: data });
            });
          }
        }
      );
      fetch(new Request("http://127.0.0.1:8080/leaderboard")).then(response => {
        response.json().then(data => {
          console.log(data);
          this.setState({ board: data });
        });
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id="main">
          <p id="msg"> </p>
          Quizzes Played By you-->
          <br />
          {this.state.scores !== undefined ? (
            <table border="5">
              <thead>
                <tr>
                  <td>Quiz Name</td>
                  <td>Correct</td>
                  <td>Incorrect</td>
                  <td>Unanswered</td>
                  <td>Final Score</td>
                </tr>
              </thead>
              <tbody>
                {this.state.scores.map(function(item, key) {
                  return (
                    <tr>
                      <td>{item.quizPlayed}</td>
                      <td>{item.correct}</td>
                      <td>{item.incorrect}</td>
                      <td>{item.unanswered}</td>
                      <td>{item.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            function() {
              return;
            }
          )}
          <br />
          <br />
          Global Leaderboard -->
          {this.state.board !== undefined ? (
            <table border="5">
              <thead>
                <tr>
                  <td>User</td>
                  <td>Points</td>
                </tr>
              </thead>
              <tbody>
                {this.state.board.map(function(item, key) {
                  return (
                    <tr>
                      <td>{item.username}</td>
                      <td>{item.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            function() {
              return;
            }
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Leaderboard;
