import React, { Component } from "react";
import Navbar from "./navbar";

class CreateQuiz extends Component {
  state = {
    quizName: "",
    genre: "Other",
    mfc: "1",
    mfi: "0",
    mfu: "0",
    canBeAdded: false
  };

  onNameChange = e => {
    const quizName = e.target.value;
    this.setState({ quizName });
  };

  onGenreChange = e => {
    const genre = e.target.value;
    this.setState({ genre });
  };

  onMfcChange = e => {
    const mfc = e.target.value;
    this.setState({ mfc });
  };

  onMfiChange = e => {
    const mfi = e.target.value;
    this.setState({ mfi });
  };

  onMfuChange = e => {
    const mfu = e.target.value;
    this.setState({ mfu });
  };

  onQuestionChange = (e, i) => {
    let questions = this.state.questions;
    questions[i] = e.target.value;
    this.setState({ questions });
  };

  createQuestions = no => {
    var questions = [];
    for (var i = 1; i <= no; i++) {
      questions.push(
        <React.Fragment>
          <Navbar />
          <br />
          Question {i}:
          <input
            type="input"
            name={"question" + { i }}
            value={this.state.questions[i]}
            onChange={(e, i) => this.onQuestionChange(e, i)}
          />
        </React.Fragment>
      );
    }
    console.log(questions);
    return questions;
  };

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

  handleSubmit = e => {
    e.preventDefault();
    const nameToBePassed = this.state.quizName;
    const request = new Request(
      "http://127.0.0.1:8080/quizzes/" + nameToBePassed
    );
    fetch(request)
      .then(response => {
        if (response.status === 404) {
          this.state.canBeAdded = true;
        }
      })
      .then(response => {
        if (this.state.canBeAdded === true) {
          {
            this.state.canBeAdded = false;
          }
          var addingData = {
            name: this.state.quizName,
            genre: this.state.genre,
            mfc: this.state.mfc,
            mfi: this.state.mfi,
            mfu: this.state.mfu
          };
          console.log(addingData);
          fetch("http://127.0.0.1:8080/createQuiz", {
            method: "POST",
            body: JSON.stringify(addingData)
          }).then(response => {
            if (response.status === 200) {
              document.getElementById("message").textContent = "New Quiz Added";
            } else {
              document.getElementById("message").textContent =
                "empty quizName/genre not allowed";
            }
          });
        } else {
          document.getElementById("message").textContent =
            "quizName already taken";
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
            Quiz Name:{" "}
            <input
              type="text"
              name="quizname"
              value={this.state.quizName}
              onChange={e => this.onNameChange(e)}
            />
            <br />
            Genre:
            <select
              value={this.state.genre}
              onChange={e => this.onGenreChange(e)}
            >
              <option value="Other">Other</option>
              <option value="Comics">Comics</option>
              <option value="History">History</option>
              <option value="Sports">Sports</option>
            </select>
            {/*{this.createQuestions(5)}*/}
            <br />
            Marking Scheme:
            <br />
            Marks for Correct Answer:{" "}
            <select value={this.state.mfc} onChange={e => this.onMfcChange(e)}>
              <option value="1" selected>
                +1
              </option>
              <option value="2">+2</option>
              <option value="3">+3</option>
              <option value="4">+4</option>
              <option value="5">+5</option>
            </select>
            <br />
            Marks for Incorrect Answer:{" "}
            <select value={this.state.mfi} onChange={e => this.onMfiChange(e)}>
              <option value="0" selected>
                0
              </option>
              <option value="1">-1</option>
              <option value="2">-2</option>
              <option value="3">-3</option>
              <option value="4">-4</option>
              <option value="5">-5</option>
            </select>
            <br />
            Marks for Unanswered Questions:{" "}
            <select value={this.state.mfu} onChange={e => this.onMfuChange(e)}>
              <option value="0" selected>
                0
              </option>
              <option value="1">-1</option>
              <option value="2">-2</option>
              <option value="3">-3</option>
              <option value="4">-4</option>
              <option value="5">-5</option>
            </select>
            <br />
            <button type="submit">Add</button>
          </form>
          <div id="message"> </div>
        </div>
      </React.Fragment>
    );
  }
}

export default CreateQuiz;
