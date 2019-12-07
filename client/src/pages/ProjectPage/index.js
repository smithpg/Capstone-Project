import React from "react";
import styled from "styled-components";
import ProjectTree from "./ProjectTree"
import Tracking from "./Tracking"

class ProjectPage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      projectId: props.match.params.projectId,
      selectedProject: null,
      taskId: null,
      selectedTask: null,
      reports: null
    }
  }

  componentDidMount() {
    this.fetchProject();
  }

  render() {
    return (
      <AppContainer>
        <ProjectTree
          onSelect={this.onSelect}
          projectId={this.state.projectId}
          selectedProject={this.state.selectedProject}
          retrieveNode={this.retrieveNode}
          fetchProject={this.fetchProject}
        >
        </ProjectTree>
        <Tracking
          taskId={this.state.taskId}
          selectedTask={this.state.selectedTask}
          projectId={this.state.projectId}
          selectedProject={this.state.selectedProject}
          reports={this.reports}
          fetchProject={this.fetchProject}
          retrieveNode={this.retrieveNode}
          allDataPointsForNode={this.allDataPointsForNode}
          retrieveRoot={this.retrieveRoot}
          handlePermissionFormSubmit={this.handlePermissionFormSubmit}
          handleUsernamePermChange={this.handleUsernamePermChange}
          handleReadPermissionChange={this.handleReadPermissionChange}
          handleWritePermissionChange={this.handleWritePermissionChange}
          handleDeleteReadPermission={this.handleDeleteReadPermission}
          handleDeleteWritePermission={this.handleDeleteWritePermission}
        >
        </Tracking>
        
      </AppContainer>
    );  
  }

  fetchProject = () => {
    fetch('/api/projects/' + this.state.projectId)
    .then(res => {
      console.log(res)
      return res.json()
    })
    .then(proj => {
      this.setState({
        selectedProject: proj
      }, () => {
        if (this.state.selectedTask !== null && this.state.selectedTask !== undefined) {
          this.retrieveTask();
        }
      })
    })
    .catch(console.log)
  }

  retrieveTask = () => {
    const task = this.retrieveNode(this.state.taskId);
    if (task !== null && task !== undefined) {
      this.setState({
        selectedTask: task,
        reports: task.reports
      }, console.log(this.state))
    }
  }

  // on selecting a task in the tree
  onSelect = (keys, info) => {
    this.setState({
      taskId: keys[0]
    }, () => this.retrieveTask());
  }

  // return task with given key
  retrieveNode = (id) => {

    function traverse(root) {
      if (root === null) {
        return null;
      } else if (root._id === id) {
        return root;
      } else {
        return search(root.children);
      }
    }

    function search(array) {
      for (var i = 0; i < array.length; i++) {
        const node = traverse(array[i]);
        if (node != null) {
          return node;
        }
      }
      return null;
    }

    return search(this.state.selectedProject.tree);
  }

  

 

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
  }

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
    })
  }

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
    })
  }

  handlePermissionFormSubmit = (rootKey, event) => {
    event.preventDefault();
    
    const root = this.retrieveNode(this.state.data, rootKey);

    if (this.state.formValues.read && 
      !contains(root.readPermissions, this.state.formValues.usernamePerm)) {
        
        root.readPermissions.splice(root.readPermissions.length, 0, this.state.formValues.usernamePerm)
    }

    if (this.state.formValues.write && 
      !contains(root.writePermissions, this.state.formValues.usernamePerm)) {
        
        root.writePermissions.splice(root.writePermissions.length, 0, this.state.formValues.usernamePerm)
    }

    this.setState({
      formValues: {
        usernamePerm: '',
        read: false,
        write: false,
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
  }

  handleUsernamePermChange = event => {
    this.setState({
      formValues: {
        usernamePerm: event.target.value,
        read: this.state.formValues.read,
        write: this.state.formValues.write,
      }
    });
  }

  handleReadPermissionChange = event => {
    this.setState({
      formValues: {
        usernamePerm: this.state.formValues.usernamePerm,
        read: event.target.checked,
        write: this.state.formValues.write,
      }
    });
  }

  handleWritePermissionChange = event => {
    this.setState({
      formValues: {
        usernamePerm: this.state.formValues.usernamePerm,
        read: this.state.formValues.read,
        write: event.target.checked,
      }
    });
  }
  
}


const AppContainer = styled.div`
  width: 100%
  display: inline-block
`;

export default ProjectPage;
