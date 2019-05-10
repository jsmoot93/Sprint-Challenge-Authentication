import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  NavLink,
  Route
} from "react-router-dom";
import axios from "axios";
import "./App.css";

import ProtectedRoute from "./auth/protectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Jokes from "./components/Jokes";
import Register from "./components/Register";

axios.defaults.baseURL = process.env.API_URL || "http://localhost:3300/api";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <header>
            <nav>
              <NavLink to="/" exact>
                Home
              </NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/login">Log In</NavLink>
              <Logout />
              <NavLink to="/jokes">Jokes</NavLink>
            </nav>
          </header>

          <main>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <ProtectedRoute path="/jokes" component={Jokes} />
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}
