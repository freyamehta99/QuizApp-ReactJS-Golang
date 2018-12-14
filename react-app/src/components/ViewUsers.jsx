import React, { Component } from "react";

class ViewUsers extends Component {
  state = {
    users: []
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
      } else {
        this.fetcher();
      }
    }
  }

  fetcher() {
    fetch(new Request("http://127.0.0.1:8080/indexUsers")).then(response => {
      response.json().then(data => {
        this.setState({ users: data });
      });
    });
  }

  delHandler = e => {
    fetch("http://127.0.0.1:8080/delUser/" + e.target.name).then(
      this.fetcher()
    );
  };

  render() {
    return (
      <React.Fragment>
        <div id="main">
          <ol type="1">
            {this.state.users !== undefined
              ? this.state.users.map((item, key) => {
                  return (
                    <li>
                      {item.username}
                      {item.username !== "admin" ? (
                        <button
                          name={item.username}
                          onClick={e => this.delHandler(e)}
                        >
                          Delete
                        </button>
                      ) : (
                        function() {
                          return;
                        }
                      )}
                    </li>
                  );
                })
              : function() {
                  return;
                }}
          </ol>
        </div>
      </React.Fragment>
    );
  }
}

export default ViewUsers;
