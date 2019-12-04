import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "antd/dist/antd.css";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import ProjectsList from "./pages/ProjectsList";
import ProjectPage from './pages/ProjectPage';

// TODO: Implement this
function browserHasToken() {
  /**
   *  Check browser for auth token and return true if found
   */

  return false;
}

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data:[],
      editing: null,
      selected: null,
      selectedTab: "summary",
      formValues: {
        date: '',
        username: '',
        progress: '',
        remaining: '',
        usernamePerm: '',
        read: false,
        write: false,
      }
    }
  }
  
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact>
            {browserHasToken() ? null : <Redirect to="login" />}
          </Route>
          <Route path="/login" component={AuthPage} />
          <Route exact path="/projects">
            <ProjectsList
              data={this.state.data}
              editing={this.state.editing}
              handleEditItem={this.handleEditItem}
              handleDoneEditingClick={this.handleDoneEditingClick}
              handleEditItemClick={this.handleEditItemClick}
              handleRemoveItemClick={this.handleRemoveItemClick}
              handleAddTopLevelProjectClick={this.handleAddTopLevelProjectClick}
            >
            </ProjectsList>
          </Route>
          <Route path="/projects/:projectId" render={(routeProps) => (
            <ProjectPage
              {...routeProps}
              onDrop={this.onDrop}
              onSelect={this.onSelect}
              handleAddChildClick={this.handleAddChildClick}
              handleRemoveItemClick={this.handleRemoveItemClick}
              handleEditItemClick={this.handleEditItemClick}
              handleEditItem={this.handleEditItem}
              handleDoneEditingClick={this.handleDoneEditingClick}
              handleAddTopLevelProjectItemClick={this.handleAddTopLevelProjectItemClick}
              data={this.state.data}
              editing={this.state.editing}
              selected={this.state.selected}
              retrieveNode={this.retrieveNode}
              formValues={this.state.formValues}
              selectedTab={this.state.selectedTab}
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
            >
            </ProjectPage>
          )}
              
            >
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
  

  // ProjectList operations
  /////////////////////////////////////////////////////////////////////////

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

  // removing project from project tree
  handleRemoveItemClick = (key, event) => {
    var data = Array.from(this.state.data);
    this.removeNode(data, key);

    var selected;
    if (this.state.selected == key) {
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
    
    const newNode = {
      key: Math.floor(Math.random()*1000), 
      content: "new content", 
      children: [], 
      data: [],
      readPermissions: [],
      writePermissions: [],
    };
    data.splice(data.length, 0, newNode);
    
    this.setState({
      data: data
    });
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

  // ProjectPage operations
  /////////////////////////////////////////////////////

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

  // add top level project to project tree
  handleAddTopLevelProjectItemClick = (key) => {
    var data = Array.from(this.state.data);

    var node = this.retrieveNode(data, key);
    
    const newNode = {
      key: Math.floor(Math.random()*1000), 
      content: "new content", 
      children: [], 
      data: [],
      readPermissions: [],
      writePermissions: [],
    };
    node.children.splice(node.children.length, 0, newNode);
    
    this.setState({
      data: data
    });
  }

  // adding child to a project tree item
  handleAddChildClick = (parentKey, event) => {
    var data = Array.from(this.state.data);
    const parent = this.retrieveNode(data, parentKey);
    const newNode = {
      key: Math.floor(Math.random()*1000), 
      content: "new content", 
      children: [], 
      data: [],
      readPermissions: [],
      writePermissions: [],
    };
    
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
    
    const newNode = {
      key: Math.floor(Math.random()*1000), 
      content: "new content", 
      children: [], 
      data: [],
      readPermissions: [],
      writePermissions: [],
    };
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

  handlePermissionsTabClick = () => {
    this.setState({
      selectedTab: "permissions"
    })
  }

  // handle adding data for an item
  handleFormSubmit = event => {
    event.preventDefault();
    const trackingData = {};
    trackingData.username = this.state.formValues.username;
    trackingData.date = this.state.formValues.date;
    trackingData.progress = this.state.formValues.progress;
    trackingData.remaining = this.state.formValues.remaining;
    trackingData.key = Math.floor(Math.random()*1000);
    const node = this.retrieveNode(this.state.data, this.state.selected);
    node.data.splice(node.data.length, 0, trackingData);
    node.data = this.sortTrackingData(node.data);
    this.setState({
      formValues: {
        date: '',
        username: '',
        progress: '',
        remaining: ''
      }
    });
  }

  // sort tracking data by date
  sortTrackingData = data => {
    var trackingData = Array.from(data);
    trackingData.sort((a,b) => {
      return this.dateInMillisFromString(a.date) - this.dateInMillisFromString(b.date);
    });
    return trackingData;
  }

  // calulate date in milliseconds from date string
  dateInMillisFromString = dateStr => {
    const components = dateStr.split("-");
    const year = parseInt(components[0])
    const month = parseInt(components[1]) - 1;
    const day = parseInt(components[2]);
    return (new Date(year, month, day)).getTime();
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
      if (total == 0) {
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

export default App;
