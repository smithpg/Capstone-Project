import React from "react";
import styled from "styled-components";
import ProjectTree from "./ProjectTree"
import Tracking from "./Tracking"

class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      editing: null,
      selected: null,
      selectedTab: "summary",
      formValues: {
        date: '',
        username: '',
        progress: '',
        remaining: ''
      }
    };
  }

  render() {
    return (
      <AppContainer>
        <ProjectTree
          onDrop={this.onDrop}
          onSelect={this.onSelect}
          handleAddChildClick={this.handleAddChildClick}
          handleRemoveItemClick={this.handleRemoveItemClick}
          handleEditItemClick={this.handleEditItemClick}
          handleEditItem={this.handleEditItem}
          handleDoneEditingClick={this.handleDoneEditingClick}
          handleAddTopLevelProjectClick={this.handleAddTopLevelProjectClick}
          data={this.state.data}
          editing={this.state.editing}
        >
        </ProjectTree>
        <Tracking
          selected={this.state.selected}
          data={this.state.data}
          retrieveNode={this.retrieveNode}
          formValues={this.state.formValues}
          selectedTab={this.state.selectedTab}
          handleSummaryTabClick={this.handleSummaryTabClick}
          handleDataTabClick={this.handleDataTabClick}
          handleTrackingTabClick={this.handleTrackingTabClick}
          handleFormSubmit={this.handleFormSubmit}
          handleDateChange={this.handleDateChange}
          handleUsernameChange={this.handleUsernameChange}
          handleProgressChange={this.handleProgressChange}
          handleRemainingChange={this.handleRemainingChange}
          handleDeleteTrackingDatapoint={this.handleDeleteTrackingDatapoint}
          calculateSummaryData={this.calculateSummaryData}
        >
        </Tracking>
      </AppContainer>
    );
  }

  // on selecting a project in the tree
  onSelect = (keys, info) => {
    this.setState({
      selected: keys[0]
    });
  }

  // on dropping a project in the tree into a new position
  onDrop = (event) => {

    const dragKey = event.dragNode.props.eventKey;
    const dropKey = event.node.props.eventKey;
    const dropPosition = event.dropPosition;
    
    var data = Array.from(this.state.data);

    const dragNode = this.retrieveNode(data, dragKey);
    const dropIndex = this.indexOf(data, dropKey);

    this.removeNode(data, dragKey);
    this.insertNode(data, dragNode, dropKey, dropPosition, dropIndex);
    
    this.setState({
      data: data
    });
  }

  // return index of a project given its key within its parent's array
  indexOf = (data, key) => {

    for (var i = 0; i < data.length; i++) {
      if (data[i].key == key) {
        return i;
      }
      const index = this.indexOf(data[i].children, key);
      if (index != -1) {
        return index;
      }
    }
    return -1;
  }

  // return project with given key
  retrieveNode = (data, key) => {

    function traverse(root) {
      if (root === null) {
        return null;
      } else if (root.key == key) {
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

    return search(data);
  }

  // remove project with given key from project tree
  removeNode = (data, key) => {

    function traverse(root) {
      if (root === null) {
        return null;
      } else {
        search(root.children);
      }
    }

    function search(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].key == key) {
          array.splice(i, 1);
          return;
        }
        const node = traverse(array[i]);
        if (node != null) {
          return;
        }
      }  
    }

    search(data);      
  }

  // insert node into project tree
  insertNode = (data, dragNode, dropKey, dropPosition, dropIndex) => {

    function traverse(root) {
      if (root === null) {
        return;
      } else {
        search(root.children);
      }
    }

    function search(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].key == dropKey) {
          if (dropPosition === dropIndex - 1) {
            array.splice(i, 0, dragNode);
          } else if (dropPosition === dropIndex + 1) {
            array.splice(i + 1, 0, dragNode);
          } else {
            array[i].children.splice(array[i].children.length, 0, dragNode);
          }
            return;
        }
        traverse(array[i]);
      }    
    }

    search(data)
  }

  // adding child to a project tree item
  handleAddChildClick = (parentKey, event) => {
    var data = Array.from(this.state.data);
    const parent = this.retrieveNode(data, parentKey);
    const newNode = {key: Math.floor(Math.random()*1000), content: "new content", children: [], data: []};
    
    parent.children.splice(parent.children.length, 0, newNode);
    
    this.setState({
      data: data,
      editing: null
    });

    event.stopPropagation();
  }

  // removing project from project tree
  handleRemoveItemClick = (key, event) => {
    var data = Array.from(this.state.data);
    this.removeNode(data, key);

    var selected;
    if (this.state.selected == key) {
      console.log('deleting selected item');
      const selected = this.state.selected == key ? null : this.state.selected;
    }
    
    this.setState({
      data: data,
      selected: selected == key ? null : selected
    });

    event.stopPropagation();
  }

  // begin editing item in project tree
  handleEditItemClick = (key, event) => {
    this.setState({
      editing: key
    });
    event.stopPropagation();
  }

  // handle actual editing of item in project tree
  handleEditItem = (key, content, event) => {
    var data = Array.from(this.state.data);
    
    const node = this.retrieveNode(data, key);
    node.content = content;
    
    this.setState({
      data: data
    });

    event.stopPropagation();
  }

  // handle done editing button
  handleDoneEditingClick = (event) => {
    this.setState({
      editing: null
    })
    event.stopPropagation();
  }

  // add top level project to project tree
  handleAddTopLevelProjectClick = () => {
    var data = Array.from(this.state.data);
    
    const newNode = {key: Math.floor(Math.random()*1000), content: "new content", children: [], data: []};
    data.splice(data.length, 0, newNode);
    
    this.setState({
      data: data
    });
  }

  // load summary tab for selected project
  handleSummaryTabClick = () => {
    this.setState({
      selectedTab: "summary"
    })
  }

  // load data tab for selected project
  handleDataTabClick = () => {
    this.setState({
      selectedTab: "data"
    })
  }

  // load tracking tab for selected project
  handleTrackingTabClick = () => {
    this.setState({
      selectedTab: "tracking"
    })
  }

  // handle adding data for an item
  handleFormSubmit = event => {
    event.preventDefault();
    const trackingData = this.state.formValues;
    trackingData.key = Math.floor(Math.random()*1000);
    const node = this.retrieveNode(this.state.data, this.state.selected);
    node.data.splice(node.data.length, 0, trackingData);
    this.setState({
      formValues: {
        date: '',
        username: '',
        progress: '',
        remaining: ''
      }
    });
  }

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
  }

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
  }

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
  }

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
  }

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
  }

  // calculate summary data for a node
  // progress and remaining are summation of progress and remaining of 
  // node and all children
  calculateSummaryData = key => {

    function traverse(root) {
      var summaryData = {};
      if (root.data.length > 0) {
        summaryData.progress = root.data[root.data.length-1].progress;
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
      if (total == 0) {
        return '0%'
      } else {
        return String(100 * progress / total) + '%'
      }
    }

    const root = this.retrieveNode(this.state.data, key);
    var final = traverse(root);
    return final;
  }
}

const AppContainer = styled.div`
  width: 100%
  display: inline-block
`;

export default ProjectsPage;
