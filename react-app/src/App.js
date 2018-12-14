import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Register from "./components/RegisterUser";
import Login from "./components/LoginUser";
import CreateQuiz from "./components/CreateQuiz";
import CreateQuestion from "./components/CreateQuestion";
import ListQuizzes from "./components/ListQuizzes";
import AttemptQuiz from "./components/AttemptQuiz";
import Logout from "./components/LogoutUser";
import Home from "./components/Home";
import Navbar from "./components/navbar";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./components/AdminPanel";
import ViewUsers from "./components/ViewUsers";
import EditQuiz from "./components/editQuiz";
import Editor from "./components/editor";
import EditQuestion from "./components/editQuestion";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <Navbar />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/createQuiz" component={CreateQuiz} />
              <Route exact path="/createQuestion" component={CreateQuestion} />
              <Route exact path="/listQuizzes" component={ListQuizzes} />
              <Route exact path="/attemptQuiz/:name" component={AttemptQuiz} />
              <Route exact path="/logout" component={Logout} />
              <Route exact path="/leaderboard" component={Leaderboard} />
              <Route exact path="/adminPanel" component={AdminPanel} />
              <Route exact path="/viewUsers" component={ViewUsers} />
              <Route exact path="/editQuiz" component={EditQuiz} />
              <Route exact path="/editQuestion/:id" component={EditQuestion} />
              <Route exact path="/edit/:name" component={Editor} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
