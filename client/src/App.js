import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import "./App.css";
import AuthPage from "./pages/AuthPage";
import ProjectPage from "./pages/ProjectPage";
import ProjectsListPage from "./pages/ProjectsListPage";

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
        <Route path="/projects" exact component={ProjectsListPage} />
        <Route
          path="/projects/:project_id"
          render={({ match }) => (
            <ProjectPage projectId={match.params.project_id} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
