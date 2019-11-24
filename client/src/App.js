import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import ProjectsPage from "./pages/ProjectsPage";

// TODO: Implement this
function browserHasToken() {
  /**
   *  Check browser for auth token and return true if found
   */

  return false;
}

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact>
          {browserHasToken() ? null : <Redirect to="login" />}
        </Route>
        <Route path="/login" component={AuthPage} />
        <Route path="/projects" component={ProjectsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
