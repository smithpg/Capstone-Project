import React from "react";
import styled from "styled-components";
import ProjectTree from "./ProjectTree";
import _ from "lodash";
import Tracking from "./Tracking";

import * as treeHelpers from "../../helpers/tree";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTask: null,
      projectTitle: null,
      projectTree: null,
      reports: null
    };
  }

  replaceTree = newTree => {
    console.log(newTree);
    console.log(this.state.projectTree);

    this.setState(
      {
        projectTree: newTree
      },
      () => this.retrieveTask()
    );
  };

  componentDidMount() {
    fetch("/api/projects/" + this.props.projectId)
      .then(res => res.json())
      .then(proj => {
        this.setState({
          projectTitle: proj.title,
          projectTree: proj.tree
        });
      })
      .catch(console.log);
  }

  createTask = taskData => {
    return fetch("/api/projects/" + this.props.projectId + "/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskData)
    })
      .then(res => res.json())
      .then(newTask => {
        const newProjectTree = treeHelpers.addNode(
          this.state.projectTree,
          newTask,
          taskData.parent
        );

        this.setState({ projectTree: newProjectTree });
      });
  };

  removeTask = id => {
    fetch("/api/projects/" + this.props.projectId + "/tasks/" + id, {
      method: "DELETE"
    })
      .then(res => {
        if (res.status === 204) {
          const newProjectTree = treeHelpers.removeSubtree(
            this.state.projectTree,
            id
          );

          this.setState({ projectTree: newProjectTree });
        }
      })
      .catch(console.log);
  };

  updateTask = (taskId, update) => {
    console.log(JSON.stringify(update));

    return fetch("/api/projects/" + this.props.projectId + "/tasks/" + taskId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(update)
    })
      .then(res => {
        if (res.status < 400) {
          const newProjectTree = treeHelpers.editNode(
            this.state.projectTree,
            taskId,
            update
          );

          this.setState({ projectTree: newProjectTree });
        }
      })
      .catch(console.log);
  };

  render() {
    return (
      <AppContainer>
        <ProjectTree
          onSelect={this.onSelect}
          createTask={this.createTask}
          removeTask={this.removeTask}
          updateTask={this.updateTask}
          retrieveNode={this.retrieveNode}
          project={this.state.projectTree}
          projectTitle={this.state.projectTitle}
        ></ProjectTree>

        <Tracking
          selectedTask={this.state.selectedTask}
          retrieveNode={this.retrieveNode}
          retrieveRoot={this.retrieveRoot}
          replaceTree={this.replaceTree}
          projectTree={this.state.projectTree}
          projectId={this.props.projectId}
          handlePermissionFormSubmit={this.handlePermissionFormSubmit}
          handleUsernamePermChange={this.handleUsernamePermChange}
          handleReadPermissionChange={this.handleReadPermissionChange}
          handleWritePermissionChange={this.handleWritePermissionChange}
          handleDeleteReadPermission={this.handleDeleteReadPermission}
          handleDeleteWritePermission={this.handleDeleteWritePermission}
        ></Tracking>
      </AppContainer>
    );
  }

  retrieveTask = () => {
    console.log(this.state.taskId);

    const task = this.retrieveNode(this.state.taskId);
    if (task !== null && task !== undefined) {
      this.setState(
        {
          selectedTask: task,
          reports: task.reports
        },

        () => console.log("new state", this.state)
      );
    }
  };

  // on selecting a task in the tree
  onSelect = (keys, info) => {
    console.log("onselect::", keys);

    this.setState(
      {
        taskId: keys[0]
      },
      () => this.retrieveTask()
    );
  };

  // return task with given key
  retrieveNode = id => {
    return treeHelpers.retrieveNode(this.state.projectTree, id);
  };

  retrieveRoot = (data, key) => {
    function isChild(data, key) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].key === key || isChild(data[i].children, key)) {
          return true;
        }
      }
      return false;
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].key === key || isChild(data[i].children, key)) {
        return data[i];
      }
    }
  };

  handleDeleteReadPermission = (key, user) => {
    const data = Array.from(this.state.data);
    const node = this.retrieveRoot(data, key);
    for (var i = 0; i < node.readPermissions.length; i++) {
      if (node.readPermissions[i] == user) {
        node.readPermissions.splice(i, 1);
        break;
      }
    }
    this.setState({
      data: data
    });
  };

  handleDeleteWritePermission = (key, user) => {
    const data = Array.from(this.state.data);
    const node = this.retrieveRoot(data, key);
    for (var i = 0; i < node.writePermissions.length; i++) {
      if (node.writePermissions[i] == user) {
        node.writePermissions.splice(i, 1);
        break;
      }
    }
    this.setState({
      data: data
    });
  };

  handlePermissionFormSubmit = (rootKey, event) => {
    event.preventDefault();

    const root = this.retrieveNode(this.state.data, rootKey);

    if (
      this.state.formValues.read &&
      !contains(root.readPermissions, this.state.formValues.usernamePerm)
    ) {
      root.readPermissions.splice(
        root.readPermissions.length,
        0,
        this.state.formValues.usernamePerm
      );
    }

    if (
      this.state.formValues.write &&
      !contains(root.writePermissions, this.state.formValues.usernamePerm)
    ) {
      root.writePermissions.splice(
        root.writePermissions.length,
        0,
        this.state.formValues.usernamePerm
      );
    }

    this.setState({
      formValues: {
        usernamePerm: "",
        read: false,
        write: false
      }
    });

    function contains(arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val) {
          return true;
        }
      }
      return false;
    }
  };

  handleUsernamePermChange = event => {
    this.setState({
      formValues: {
        usernamePerm: event.target.value,
        read: this.state.formValues.read,
        write: this.state.formValues.write
      }
    });
  };

  handleReadPermissionChange = event => {
    this.setState({
      formValues: {
        usernamePerm: this.state.formValues.usernamePerm,
        read: event.target.checked,
        write: this.state.formValues.write
      }
    });
  };

  handleWritePermissionChange = event => {
    this.setState({
      formValues: {
        usernamePerm: this.state.formValues.usernamePerm,
        read: this.state.formValues.read,
        write: event.target.checked
      }
    });
  };
}

const AppContainer = styled.div`
  width: 100%
  display: inline-block
`;

export default ProjectPage;
