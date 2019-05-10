import React, { Component } from "react";
import axios from "axios";

export default class Jokes extends Component {
  state = {
    jokes: []
  };

  componentDidMount() {
    axios
      .get("/jokes")
      .then(res => {
        this.setState({
          jokes: res.data
        });
      })
      .catch(err => {
        console.error("JOKES ERROR", err);
        localStorage.removeItem("token");
      });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.jokes.map(joke => {
            return <li key={joke.id}>{joke.joke}</li>;
          })}
        </ul>
      </div>
    );
  }
}
