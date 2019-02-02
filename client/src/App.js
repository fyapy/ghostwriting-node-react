import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import jwt_decode from "jwt-decode";
import { ToastContainer } from "react-toastify";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

// Components
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Post from "./components/posts/Post";
import Posts from "./components/posts/Posts";
import PostCreate from "./components/posts/PostCreate";
import Messages from "./components/messages/Messages";
import Profile from "./components/profile/Profile";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Deals from "./components/deals/Deals";
import Сontract from "./components/deals/Сontract";
import Balance from "./components/profile/Balance";

import "./sass/App.sass";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expire token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    // Redirect to logon
    window.location.href = "/login";
  }
}

const history = createHistory();

class App extends Component {
  state = {
    isOpen: false
  };

  menuToggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  componentDidMount() {
    history.listen((location, action) => {
      this.setState({
        isOpen: false
      });
    });
  }

  onLogoutClick = e => {
    e.preventDefault();
    store.dispatch(logoutUser());
    this.forceUpdate();
  };

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div className="App">
            <ToastContainer />
            <Navbar
              isOpen={this.state.isOpen}
              onLogoutClick={this.onLogoutClick}
              menuToggle={this.menuToggle}
              history={history}
            />

            <div className={`main ${this.state.isOpen ? "opened" : ""}`}>
              <div
                onClick={this.menuToggle}
                className={`main-blocker ${this.state.isOpen ? "opened" : ""}`}
              />

              <Route exact path="/" component={Landing} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/posts" component={Posts} />
              <Route exact path="/posts/create" component={PostCreate} />
              <Route exact path="/post/:id" component={Post} />
              <Route exact path="/users" component={Users} />
              <Route exact path="/user/:id" component={User} />
              <Switch>
                <PrivateRoute exact path="/messages" component={Messages} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/deals" component={Deals} />
                <PrivateRoute exact path="/contract" component={Сontract} />
                <PrivateRoute exact path="/balance" component={Balance} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
