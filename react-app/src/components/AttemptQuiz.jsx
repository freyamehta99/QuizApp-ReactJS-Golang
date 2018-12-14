import React, { Component } from "react";
import Navbar from "./navbar";

class AttemptQuiz extends Component {
  constructor() {
    super();
    this.state = {
      quiz: "",
      user: "",
      started: 0,
      questions: [],
      answers: [],
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      score: 0,
      lifeline: 1,
      lifelinesLeft: 0
    };
  }

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      this.setState({ user: ret });
    }
    const quizName = this.props.match.params.name;
    const req = new Request("http://127.0.0.1:8080/quizzes/" + quizName);
    fetch(req).then(response => {
      if (response.status === 404) {
        window.location.href = "/createQuiz";
      } else {
        response.json().then(data => {
          this.setState({ quiz: data });
        });
      }
    });
    fetch(
      "http://127.0.0.1:8080/getLifelines/" + localStorage.getItem("username")
    ).then(response => {
      response.json().then(data => {
        this.setState({ lifelinesLeft: data.lifelines });
      });
    });
  }

  onStart = e => {
    e.preventDefault();
    const request = new Request(
      "http://127.0.0.1:8080/getQuestions/" + this.state.quiz.name
    );
    fetch(request).then(response => {
      response.json().then(data => {
        this.state.started = 1;
        this.setState({ questions: data });
        for (var i = 0; i < data.length; i++) {
          this.state.answers.push([false, false, false, false]);
        }
      });
    });
  };

  reset = () => {
    this.setState({ correct: 0 });
    this.setState({ incorrect: 0 });
    this.setState({ unanswered: 0 });
    this.setState({ score: 0 });
  };

  onQuizDone = e => {
    e.preventDefault();

    function comp(arr1, arr2) {
      var f = 0;
      for (var i = 0; i < 4; i++) {
        if (arr1[i] != arr2[i]) {
          f++;
        }
      }
      if (f == 0) {
        return true;
      } else {
        return false;
      }
    }

    for (var i = 0; i < this.state.answers.length; i++) {
      if (comp(this.state.answers[i], [false, false, false, false])) {
        this.state.unanswered += 1;
        this.state.score -= parseInt(this.state.quiz.mfu);
        document.getElementById("rightOrNot#" + i).innerHTML = "(Unanswered)";
      } else {
        var sahijawab = [
          this.state.questions[i].correcta,
          this.state.questions[i].correctb,
          this.state.questions[i].correctc,
          this.state.questions[i].correctd
        ];
        if (comp(this.state.answers[i], sahijawab)) {
          this.state.correct += 1;
          this.state.score += parseInt(this.state.quiz.mfc);
          document.getElementById("rightOrNot#" + i).innerHTML = "(Correct)";
        } else {
          this.state.incorrect += 1;
          this.state.score -= parseInt(this.state.quiz.mfi);
          document.getElementById("rightOrNot#" + i).innerHTML = "(Wrong)";
        }
      }
    }
    document.getElementById("result").innerHTML =
      "<h3>Result:</h3>Correct:" +
      this.state.correct +
      "<br />Incorrect:" +
      this.state.incorrect +
      "<br />Unanswered:" +
      this.state.unanswered +
      "<br />Score: " +
      this.state.score +
      "<hr/>";
    var scoreData = {
      quizPlayed: this.state.quiz.name,
      user: this.state.user,
      correct: this.state.correct,
      incorrect: this.state.incorrect,
      unanswered: this.state.unanswered,
      points: this.state.score
    };
    fetch("http://127.0.0.1:8080/createScore", {
      method: "POST",
      body: JSON.stringify(scoreData)
    });
    this.reset();
  };

  onUpdateSelection = (e, type) => {
    console.log("here");
    if (type === 1) {
      this.state.answers[e.target.name][e.target.value - 1] = true;
    } else {
      this.state.answers[e.target.name][e.target.value - 1] = e.target.checked;
    }
  };

  lifelineChange = e => {
    this.setState({ lifeline: e.target.value });
  };

  showAnswer = e => {
    if (this.state.lifelinesLeft < 1) {
    } else {
      const q = this.state.lifeline - 1;
      console.log(q);
      document.getElementById("rightOrNot#" + q).textContent =
        "Correct options are -> " +
        (this.state.questions[q].correcta === true ? "A" : "") +
        (this.state.questions[q].correctb === true ? "B" : "") +
        (this.state.questions[q].correctc === true ? "C" : "") +
        (this.state.questions[q].correctd === true ? "D" : "");
      fetch(
        "http://127.0.0.1:8080/reduceLifeline/" +
          localStorage.getItem("username")
      );
      const left = this.state.lifelinesLeft - 1;
      this.setState({ lifelinesLeft: left });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="result">
          <br />
        </div>
        <div id="main">
          {this.state.started === 1 ? (
            <div>
              <h1>Playing quiz '{this.state.quiz.name}'</h1>
              <hr />
              <p>
                Marking Scheme:
                <br />
                Correct: +{this.state.quiz.mfc} ; Incorrect: -
                {this.state.quiz.mfi} ; Unanswered: -{this.state.quiz.mfu}
              </p>
              <p>
                Lifelines Left : {this.state.lifelinesLeft}
                <br />
                Use lifeline for question :{" "}
                <select onChange={e => this.lifelineChange(e)}>
                  {this.state.questions.map((item, key) => {
                    return <option value={key + 1}>{key + 1}</option>;
                  })}
                </select>{" "}
                <button onClick={e => this.showAnswer(e)}>Show Answer</button>
              </p>
              <form onSubmit={e => this.onQuizDone(e)}>
                <ul type="1">
                  {this.state.questions.map((value, key) => {
                    var type;
                    if (value.type == 1) {
                      type = "radio";
                    } else {
                      type = "checkbox";
                    }
                    return (
                      <li>
                        {value.question} <p id={"rightOrNot#" + key}> </p>
                        <br />
                        <ul type="A">
                          <li>
                            <input
                              type={type}
                              name={key}
                              value="1"
                              //  checked={this.state.answers[{ key }] === "1"}
                              onChange={e =>
                                this.onUpdateSelection(e, { type })
                              }
                            />
                            {value.optionA}
                          </li>
                          <li>
                            <input
                              type={type}
                              name={key}
                              value="2"
                              //  checked={this.state.answers[{ key }] === "2"}
                              onChange={e =>
                                this.onUpdateSelection(e, { type })
                              }
                            />
                            {value.optionB}
                          </li>
                          <li>
                            <input
                              type={type}
                              name={key}
                              value="3"
                              //  checked={this.state.answers[{ key }] === "3"}
                              onChange={e =>
                                this.onUpdateSelection(e, { type })
                              }
                            />
                            {value.optionC}
                          </li>
                          <li>
                            <input
                              type={type}
                              name={key}
                              value="4"
                              //  checked={this.state.answers[{ key }] === "4"}
                              onChange={e =>
                                this.onUpdateSelection(e, { type })
                              }
                            />
                            {value.optionD}
                          </li>
                        </ul>
                        <hr />
                      </li>
                    );
                  })}
                </ul>
                <button type="submit">Submit</button>
              </form>
            </div>
          ) : (
            <div>
              <h1>Welcome to quiz '{this.state.quiz.name}'</h1>
              <hr />
              <table border="2">
                <thead>
                  <tr>
                    <td>Answer</td>
                    <td>Score</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Correct</td>
                    <td>+{this.state.quiz.mfc}</td>
                  </tr>
                  <tr>
                    <td>Incorrect</td>
                    <td>-{this.state.quiz.mfi}</td>
                  </tr>
                  <tr>
                    <td>Unanswered</td>
                    <td>-{this.state.quiz.mfu}</td>
                  </tr>
                </tbody>
              </table>
              <form onSubmit={e => this.onStart(e)}>
                <button type="submit">Start playing!</button>
              </form>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default AttemptQuiz;
