import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import ProjectsList from "./pages/ProjectsList";
import ProjectPage from "./pages/ProjectPage";

// TODO: Implement this
function browserHasToken() {
  // if (req.session.token) {
  //     res.cookie('token', req.session.token);
  //     return true;
  // } else {
  //     res.cookie('token', '')
  //     return false;
  // }
  return false;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            {browserHasToken() ? null : <Redirect to="login" />}
          </Route>
          <Route path="/login" component={AuthPage} />
          <Route exact path="/projects" component={ProjectsList}></Route>
          <Route
            path="/projects/:projectId"
            render={routeProps => (
              <ProjectPage
                projectId={routeProps.match.params.projectId}
              ></ProjectPage>
            )}
          ></Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
