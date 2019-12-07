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
          formValues={this.formValues}
          selectedTab={this.selectedTab}
          handleSummaryTabClick={this.handleSummaryTabClick}
          handleDataTabClick={this.handleDataTabClick}
          handleTrackingTabClick={this.handleTrackingTabClick}
          handlePermissionsTabClick={this.handlePermissionsTabClick}
          calculateSummaryData={this.calculateSummaryData}
          allDataPointsForNode={this.allDataPointsForNode}
          retrieveRoot={this.retrieveRoot}
          handlePermissionFormSubmit={this.handlePermissionFormSubmit}
          handleUsernamePermChange={this.handleUsernamePermChange}
          handleReadPermissionChange={this.handleReadPermissionChange}
          handleWritePermissionChange={this.handleWritePermissionChange}
          handleDeleteReadPermission={this.handleDeleteReadPermission}
          handleDeleteWritePermission={this.handleDeleteWritePermission}
          project={this.props.match.params.projectId}
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
      })
    })
    .catch(console.log)
  }

  retrieveTask = () => {
    const task = this.retrieveNode(this.state.taskId);
    this.setState({
      selectedTask: task,
      reports: task.reports
    }, console.log(this.state))
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

  // calculate summary data for a node
  // progress is summation of all progress datapoints
  // remaining is most recent remaining datapoint
  calculateSummaryData = key => {

    function traverse(root) {
      var summaryData = {};
      if (root.data.length > 0) {
        summaryData.progress = sumProgress(root.data);
        summaryData.remaining = root.data[root.data.length-1].remaining;
        summaryData.total = summaryData.progress + summaryData.remaining;
        summaryData.percent = percentComplete(summaryData.progress, summaryData.total);
      } else {
        summaryData.progress = 0;
        summaryData.remaining = 0;
        summaryData.total = 0;
        summaryData.percent = "0%";
      }
      for (var i = 0; i < root.children.length; i++) {
        var childData = traverse(root.children[i]);
        summaryData.progress +=  childData.progress;
        summaryData.remaining += childData.remaining;
        summaryData.total = summaryData.progress + summaryData.remaining;
        summaryData.percent = percentComplete(summaryData.progress, summaryData.total);
      }
      return summaryData;
    }

    function percentComplete(progress, total) {
      if (total === 0) {
        return '0%'
      } else {
        return String(Math.round(100 * 100 * progress / total) / 100) + '%';
      }
    }

    function sumProgress(data) {
      var sum = 0;
      data.map(p => sum += p.progress);
      return sum;
    }

    const data = Array.from(this.state.data);
    const root = this.retrieveNode(data, key);
    return traverse(root);
  }

  allDataPointsForNode = key => {
    
    function collect(root, datapoints) {
      var data = datapoints.concat(root.data);
      for (var i = 0; i < root.children.length; i++) {
        data = collect(root.children[i], Array.from(data));
      }
      return data;
    }

    const data = Array.from(this.state.data);
    const node = this.retrieveNode(data, key);
    return collect(node, []);
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
