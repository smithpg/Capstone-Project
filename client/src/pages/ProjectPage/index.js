import React from "react";
import styled from "styled-components";
import ProjectTree from "./ProjectTree";
import _ from "lodash";
import Tracking from "./Tracking";

class ProjectPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTask: null,
      project: null
    };
  }

  componentDidMount() {
    fetch("/api/projects/" + this.props.projectId)
      .then(res => res.json())
      .then(proj => {
        this.setState({
          project: proj
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
        const clonedProject = _.cloneDeep(this.state.project);
        console.log(clonedProject);
        // If this was a top level task
        if (!taskData.parent) {
          clonedProject.tree.push(newTask);
        } else {
          const parent = this.retrieveNode(taskData.parent, clonedProject);

          parent.children.push(newTask);
        }

        this.setState({ project: clonedProject });
      });
  };

  // return task with given key
  retrieveNode = (id, tree) => {
    console.log(id, tree);

    function traverse(root) {
      if (root._id === id) {
        return root;
      } else if (root.children) {
        return search(root.children);
      }

      return null;
    }

    function search(array) {
      if (array) return null;
      for (var i = 0; i < array.length; i++) {
        const node = traverse(array[i]);
        if (node != null) {
          return node;
        }
      }
    }
    return search(tree);
  };

  render() {
    return (
      <AppContainer>
        <ProjectTree
          onSelect={this.onSelect}
          createTask={this.createTask}
          retrieveNode={this.retrieveNode}
          project={this.state.project}
        ></ProjectTree>

        {/* <Tracking
          selected={this.selected}
          data={this.data}
          retrieveNode={this.retrieveNode}
          formValues={this.formValues}
          selectedTab={this.selectedTab}
          handleSummaryTabClick={this.handleSummaryTabClick}
          handleDataTabClick={this.handleDataTabClick}
          handleTrackingTabClick={this.handleTrackingTabClick}
          handlePermissionsTabClick={this.handlePermissionsTabClick}
          handleFormSubmit={this.handleFormSubmit}
          handleDateChange={this.handleDateChange}
          handleUsernameChange={this.handleUsernameChange}
          handleProgressChange={this.handleProgressChange}
          handleRemainingChange={this.handleRemainingChange}
          handleDeleteTrackingDatapoint={this.handleDeleteTrackingDatapoint}
          calculateSummaryData={this.calculateSummaryData}
          allDataPointsForNode={this.allDataPointsForNode}
          dateInMillisFromString={this.dateInMillisFromString}
          retrieveRoot={this.retrieveRoot}
          handlePermissionFormSubmit={this.handlePermissionFormSubmit}
          handleUsernamePermChange={this.handleUsernamePermChange}
          handleReadPermissionChange={this.handleReadPermissionChange}
          handleWritePermissionChange={this.handleWritePermissionChange}
          handleDeleteReadPermission={this.handleDeleteReadPermission}
          handleDeleteWritePermission={this.handleDeleteWritePermission}
          project={this.state.project}
        ></Tracking> */}
      </AppContainer>
    );
  }

  // on selecting a project in the tree
  onSelect = (keys, info) => {
    this.setState({
      selected: keys[0]
    });
  };

  // load summary tab for selected project
  handleSummaryTabClick = () => {
    this.setState({
      selectedTab: "summary"
    });
  };

  // load data tab for selected project
  handleDataTabClick = () => {
    this.setState({
      selectedTab: "data"
    });
  };

  // load tracking tab for selected project
  handleTrackingTabClick = () => {
    this.setState({
      selectedTab: "tracking"
    });
  };

  handlePermissionsTabClick = () => {
    this.setState({
      selectedTab: "permissions"
    });
  };

  // handle adding data for an item
  handleFormSubmit = event => {
    event.preventDefault();
    const trackingData = {};
    trackingData.username = this.state.formValues.username;
    trackingData.date = this.state.formValues.date;
    trackingData.progress = this.state.formValues.progress;
    trackingData.remaining = this.state.formValues.remaining;
    trackingData.key = Math.floor(Math.random() * 1000);
    const node = this.retrieveNode(this.state.data, this.state.selected);
    node.data.splice(node.data.length, 0, trackingData);
    node.data = this.sortTrackingData(node.data);
    this.setState({
      formValues: {
        date: "",
        username: "",
        progress: "",
        remaining: ""
      }
    });
  };

  // sort tracking data by date
  sortTrackingData = data => {
    var trackingData = Array.from(data);
    trackingData.sort((a, b) => {
      return (
        this.dateInMillisFromString(a.date) -
        this.dateInMillisFromString(b.date)
      );
    });
    return trackingData;
  };

  // calulate date in milliseconds from date string
  dateInMillisFromString = dateStr => {
    const components = dateStr.split("-");
    const year = parseInt(components[0]);
    const month = parseInt(components[1]) - 1;
    const day = parseInt(components[2]);
    return new Date(year, month, day).getTime();
  };

  // handle date entry
  handleDateChange = event => {
    this.setState({
      formValues: {
        date: event.target.value,
        username: this.state.formValues.username,
        progress: this.state.formValues.progress,
        remaining: this.state.formValues.remaining
      }
    });
  };

  // handle username entry
  handleUsernameChange = event => {
    this.setState({
      formValues: {
        date: this.state.formValues.date,
        username: event.target.value,
        progress: this.state.formValues.progress,
        remaining: this.state.formValues.remaining
      }
    });
  };

  // handle progress entry
  handleProgressChange = event => {
    this.setState({
      formValues: {
        date: this.state.formValues.date,
        username: this.state.formValues.username,
        progress: Number(event.target.value),
        remaining: this.state.formValues.remaining
      }
    });
  };

  // handle remaining entry
  handleRemainingChange = event => {
    this.setState({
      formValues: {
        date: this.state.formValues.date,
        username: this.state.formValues.username,
        progress: this.state.formValues.progress,
        remaining: Number(event.target.value)
      }
    });
  };

  // handle deleting a tracking data point
  handleDeleteTrackingDatapoint = (nodeKey, trackingKey) => {
    var data = Array.from(this.state.data);
    const node = this.retrieveNode(data, nodeKey);
    for (var i = 0; i < node.data.length; i++) {
      if (node.data[i].key == trackingKey) {
        node.data.splice(i, 1);
        break;
      }
    }
    this.setState({
      data: data
    });
  };

  // calculate summary data for a node
  // progress is summation of all progress datapoints
  // remaining is most recent remaining datapoint
  calculateSummaryData = key => {
    function traverse(root) {
      var summaryData = {};
      if (root.data.length > 0) {
        summaryData.progress = sumProgress(root.data);
        summaryData.remaining = root.data[root.data.length - 1].remaining;
        summaryData.total = summaryData.progress + summaryData.remaining;
        summaryData.percent = percentComplete(
          summaryData.progress,
          summaryData.total
        );
      } else {
        summaryData.progress = 0;
        summaryData.remaining = 0;
        summaryData.total = 0;
        summaryData.percent = "0%";
      }
      for (var i = 0; i < root.children.length; i++) {
        var childData = traverse(root.children[i]);
        summaryData.progress += childData.progress;
        summaryData.remaining += childData.remaining;
        summaryData.total = summaryData.progress + summaryData.remaining;
        summaryData.percent = percentComplete(
          summaryData.progress,
          summaryData.total
        );
      }
      return summaryData;
    }

    function percentComplete(progress, total) {
      if (total == 0) {
        return "0%";
      } else {
        return String(Math.round((100 * 100 * progress) / total) / 100) + "%";
      }
    }

    function sumProgress(data) {
      var sum = 0;
      data.map(p => (sum += p.progress));
      return sum;
    }

    const data = Array.from(this.state.data);
    const root = this.retrieveNode(data, key);
    return traverse(root);
  };

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
  };

  retrieveRoot = (data, key) => {
    function isChild(data, key) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].key == key || isChild(data[i].children, key)) {
          return true;
        }
      }
      return false;
    }

    for (var i = 0; i < data.length; i++) {
      if (data[i].key == key || isChild(data[i].children, key)) {
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
