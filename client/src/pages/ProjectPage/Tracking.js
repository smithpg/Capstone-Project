import React from 'react';
import styled from 'styled-components';
import DataTab from './DataTab'
import SummaryTab from './SummaryTab'
import TrackingTab from './TrackingTab'
import PermissionsTab from './PermissionsTab'

class Tracking extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'data'
        };
    }

    componentDidMount() {
    }

    renderTitle = () => {        
        if (this.props.selectedTask !== null && this.props.selectedTask !== undefined && this.state.selectedTab != 'permissions') {
            return <h1>{this.props.selectedTask.title}</h1>
        }
        return <h1></h1>
    }

    renderDataTab = () => {
        if (this.props.selectedTask !== null && this.props.selectedTask !== undefined) {
            return (
                <DataTab
                    taskId={this.props.taskId}
                    selectedTask={this.props.selectedTask}
                    projectId={this.props.projectId}
                    selectedProject={this.props.selectedProject}
                    fetchProject={this.props.fetchProject}
                    reports={this.reports}
                ></DataTab>
            );
        }
    }

    /*
    renderSummaryTab = () => {
        if (props.selected != null) {
            return (
                <SummaryTab
                    selected={props.selected}
                    calculateSummaryData={props.calculateSummaryData}
                    retrieveNode={props.retrieveNode}
                    dateInMillisFromString={props.dateInMillisFromString}
                ></SummaryTab>
            );
        } else if (root != null) {
            return (
                <SummaryTab
                    data={props.data}
                    selected={root.key}
                    calculateSummaryData={props.calculateSummaryData}
                    retrieveNode={props.retrieveNode}
                    dateInMillisFromString={props.dateInMillisFromString}
                ></SummaryTab>
            );
        } else {
            return (<React.Fragment></React.Fragment>);
        }
        
    }

    renderTrackingTab = () => {
        if (props.selected != null) {
            return (
                <TrackingTab
                    selected={props.selected}
                    allDataPointsForNode={props.allDataPointsForNode}
                    dateInMillisFromString={props.dateInMillisFromString}
                >     
                </TrackingTab>
            )
        } else if (root != null) {
            return (
                <TrackingTab
                    selected={props.selected}
                    allDataPointsForNode={props.allDataPointsForNode}
                    dateInMillisFromString={props.dateInMillisFromString}
                >     
                </TrackingTab>
            )
        } else {
            return (<React.Fragment></React.Fragment>);
        }
        
    }

    renderPermissionsTab = () => {
        return (
            <PermissionsTab
                data={props.data}
                root={root.key}
                retrieveNode={props.retrieveNode}
                handlePermissionFormSubmit={props.handlePermissionFormSubmit}
                handleUsernamePermChange={props.handleUsernamePermChange}
                handleReadPermissionChange={props.handleReadPermissionChange}
                handleWritePermissionChange={props.handleWritePermissionChange}
                handleDeleteReadPermission={props.handleDeleteReadPermission}
                handleDeleteWritePermission={props.handleDeleteWritePermission}
                formValues={props.formValues}
            >
            </PermissionsTab>
        );
    }
    */

    renderTab = (node) => {

        if (this.props.selectedTask !== null && this.state.selectedTab == 'data') {
            return this.renderDataTab();
        } else if (this.state.selectedTab == 'summary') {
            //return renderSummaryTab();
        } else if (this.state.selectedTab == 'tracking') {
            //return renderTrackingTab();
        } else if (this.state.selectedTab == 'permissions') {
            //return renderPermissionsTab();
        }
    }

    // return task with given key
  retrieveNode = (id) => {

        function traverse(root) {
        console.log(root)
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

        return search(this.state.project);
    }

    render() {
        return (
            <Container>
                <TabGroup>
                    <Tab
                        onClick={() => this.handleSummaryTabClick()}
                    >Summary</Tab>
                    <Tab
                        onClick={() => this.handleDataTabClick()}
                    >Data</Tab>
                    <Tab
                        onClick={() => this.handleTrackingTabClick()}
                    >Tracking</Tab>
                    <Tab
                        onClick={() => this.handlePermissionsTabClick()}
                    >Permissions</Tab>
                </TabGroup>
                <TitleContainer>
                    {this.renderTitle()}
                </TitleContainer>
                <TabContentContainer>
                    {this.renderTab()}
                </TabContentContainer>
            </Container>
        );
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
}

const Container = styled.div`
    width: 66%
    display: inline-block
`;

const TabGroup = styled.div`
    margin: 16px
`;

const Tab = styled.button`
    border: solid 1px
    background-color: LightGray
    border-radius: 8px
    margin: 2px
    font-weight: bold
    focus-outline: 0;
`;

const TitleContainer = styled.div`
    margin: 16px
`;

const TabContentContainer = styled.div`
    margin: 16px
`;

export default Tracking;