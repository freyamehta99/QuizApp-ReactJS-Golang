import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class Editor extends Component {
  state = {
    quiz: "",
    questions: []
  };

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      this.setState({ quiz: this.props.match.params.name });
      fetch(
        "http://127.0.0.1:8080/getQuestions/" + this.props.match.params.name
      ).then(response => {
        if (response.status === 404) {
          document.getElementById("main").textContent = "No such quiz exists";
        } else {
          response.json().then(data => {
            this.setState({ questions: data });
          });
        }
      });
    }
  }

  DelQuestion = (e, ind) => {
    console.log(ind);
    fetch(
      new Request(
        "http://127.0.0.1:8080/delQuestion/" + this.state.questions[ind].ID
      )
    ).then(r => {
      const arr = this.state.questions;
      arr.splice(ind, 1);
      this.setState({ questions: arr });
      this.render();
    });
  };

  render() {
    return (
      <React.Fragment>
        <div id="main">
          Questions present in quiz '{this.state.quiz}' -->
          <hr />
          {this.state.questions !== undefined ? (
            <ol type="1">
              {this.state.questions.map((item, key) => {
                return (
                  <li>
                    {item.question} (
                    {item.type == 1 ? "Single Correct" : "Multiple Correct"}){" "}
                    <Link to={"/editQuestion/" + item.ID}>
                      <button>Edit</button>
                    </Link>
                    <button name={key} onClick={e => this.DelQuestion(e, key)}>
                      Delete
                    </button>
                    <br />
                    A: {item.optionA}
                    <br />
                    B: {item.optionB}
                    <br />
                    C: {item.optionC}
                    <br />
                    D: {item.optionD}
                    <br />
                    <hr />
                  </li>
                );
              })}
            </ol>
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

export default Editor;
