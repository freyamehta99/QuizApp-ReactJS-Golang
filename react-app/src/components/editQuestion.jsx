import React, { Component } from "react";

class EditQuestion extends Component {
  state = {
    q: "",
    question: "",
    type: "1",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    quiz: "",
    options: [false, false, false, false],
    toBeorNotroBe: false,
    data: []
  };

  reset = () => {
    this.setState({ question: "" });
    this.setState({ optionA: "" });
    this.setState({ optionB: "" });
    this.setState({ optionC: "" });
    this.setState({ optionD: "" });
    this.setState({ options: [false, false, false, false] });
    for (var i = 1; i <= 4; i++) {
      document.getElementsByName(i).checked = false;
    }
  };

  componentDidMount() {
    var ret = localStorage.getItem("username");
    if (ret === null) {
      document.getElementById("main").textContent = "First Login Please";
      setTimeout(function() {
        window.location.href = "/login";
      }, 1500);
    } else {
      fetch(
        new Request(
          "http://127.0.0.1:8080/getOneQuestion/" + this.props.match.params.id
        )
      ).then(response => {
        response.json().then(data => {
          console.log(data);
          this.setState({ q: data });
        });
      });
    }
  }

  onQuestionChange = e => {
    const question = e.target.value;
    this.setState({ question });
  };

  onTypeChange = e => {
    const type = e.target.value;
    this.setState({ type });
  };

  onOptionChange = (e, option) => {
    const value = e.target.value;
    switch (option) {
      case 1:
        this.setState({ optionA: value });
        break;
      case 2:
        this.setState({ optionB: value });
        break;
      case 3:
        this.setState({ optionC: value });
        break;
      case 4:
        this.setState({ optionD: value });
        break;
    }
  };

  onCorrectChange = e => {
    const option = e.target.name;
    this.state.options[option - 1] = e.target.checked;
  };

  handleSubmit = e => {
    e.preventDefault();
    let count = 0;
    let ind;
    for (var i = 0; i < 4; i++) {
      if (this.state.options[i] === true) {
        count += 1;
        ind = i;
      }
    }
    if (this.state.type == 1 && count > 1) {
      document.getElementById("message").textContent =
        "Type is Single Correct Answer but multiple correct answers given.";
    } else {
      var questionData = {
        question: this.state.question,
        type: this.state.type,
        optionA: this.state.optionA,
        optionB: this.state.optionB,
        optionC: this.state.optionC,
        optionD: this.state.optionD,
        correcta: this.state.options[0],
        correctb: this.state.options[1],
        correctc: this.state.options[2],
        correctd: this.state.options[3],
        quiz: this.state.q.quiz
      };
      fetch("http://127.0.0.1:8080/createQuestion", {
        method: "POST",
        body: JSON.stringify(questionData)
      }).then(response => {
        if (response.status === 404) {
          document.getElementById("message").textContent =
            "Question/Correct Answer fields can't be empty.";
        } else {
          fetch("http://127.0.0.1:8080/delQuestion/" + this.state.q.ID);
          document.getElementById("message").textContent = "Question Updated";
          this.reset();
        }
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div id="main">
          Edit question for Quiz {this.state.q.quiz}:<br />
          <form onSubmit={e => this.handleSubmit(e)}>
            Type of Question:{" "}
            <select
              value={this.state.type}
              onChange={e => this.onTypeChange(e)}
            >
              <option value="1" selected>
                Single Correct Answer
              </option>
              <option value="2">Multiple Correct Answer</option>
            </select>
            <br />
            Question :{" "}
            <input
              type="text"
              name="question"
              value={this.state.question}
              onChange={e => this.onQuestionChange(e)}
            />
            <br />
            Option A:
            <input
              type="text"
              name="optionA"
              value={this.state.optionA}
              onChange={e => this.onOptionChange(e, 1)}
            />
            <br />
            Option B:
            <input
              type="text"
              name="optionB"
              value={this.state.optionB}
              onChange={e => this.onOptionChange(e, 2)}
            />
            <br />
            Option C:
            <input
              type="text"
              name="optionC"
              value={this.state.optionC}
              onChange={e => this.onOptionChange(e, 3)}
            />
            <br />
            Option D:
            <input
              type="text"
              name="optionD"
              value={this.state.optionD}
              onChange={e => this.onOptionChange(e, 4)}
            />
            <br />
            Correct Answer:
            <br />
            <input
              type="checkbox"
              name="1"
              onChange={e => this.onCorrectChange(e)}
            />
            {this.state.optionA}
            <br />
            <input
              type="checkbox"
              name="2"
              onChange={e => this.onCorrectChange(e)}
            />
            {this.state.optionB}
            <br />
            <input
              type="checkbox"
              name="3"
              onChange={e => this.onCorrectChange(e)}
            />
            {this.state.optionC}
            <br />
            <input
              type="checkbox"
              name="4"
              onChange={e => this.onCorrectChange(e)}
            />
            {this.state.optionD}
            <br />
            <button type="submit">Update</button>
          </form>
          <div id="message"> </div>
          <div>
            Current Question->
            <br />
            {this.state.q !== undefined ? (
              <div>
                Q. {this.state.q.question}
                <br />
                A: {this.state.q.optionA}
                <br />
                B: {this.state.q.optionB}
                <br />
                C: {this.state.q.optionC}
                <br />
                D: {this.state.q.optionD}
                <br />
              </div>
            ) : (
              function() {
                return;
              }
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default EditQuestion;
