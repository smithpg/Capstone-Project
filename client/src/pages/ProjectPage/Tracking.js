import React from "react";
import styled from "styled-components";
import DataTab from "./DataTab";
import SummaryTab from "./SummaryTab";
import TrackingTab from "./TrackingTab";
import PermissionsTab from "./PermissionsTab";

class Tracking extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: "data"
    };
  }

  renderTitle = () => {
    if (
      this.props.selectedTask !== null &&
      this.props.selectedTask !== undefined &&
      this.state.selectedTab != "permissions"
    ) {
      return <h1>{this.props.selectedTask.title}</h1>;
    }
    return <h1></h1>;
  };

  renderDataTab = () => {
    if (
      this.props.selectedTask !== null &&
      this.props.selectedTask !== undefined
    ) {
      return (
        <DataTab
          selectedTask={this.props.selectedTask}
          selectedProject={this.props.selectedProject}
          projectTree={this.props.projectTree}
          replaceTree={this.props.replaceTree}
          fetchProject={this.props.fetchProject}
          reports={this.props.reports}
          sortTrackingData={this.sortTrackingData}
          dateInMillisFromString={this.dateInMillisFromString}
        ></DataTab>
      );
    }
    return <h1></h1>;
  };

  renderSummaryTab = () => {
    return (
      <SummaryTab
        taskId={this.props.taskId}
        selectedTask={this.props.selectedTask}
        projectId={this.props.projectId}
        selectedProject={this.props.selectedProject}
        fetchProject={this.props.fetchProject}
        reports={this.props.reports}
        sortTrackingData={this.sortTrackingData}
        dateInMillisFromString={this.dateInMillisFromString}
        retrieveNode={this.props.retrieveNode}
      ></SummaryTab>
    );
  };

  renderTrackingTab = () => {
    return this.props.selectedTask ? (
      <TrackingTab
        taskId={this.props.taskId}
        selectedTask={this.props.selectedTask}
        projectId={this.props.projectId}
        selectedProject={this.props.selectedProject}
        dateInMillisFromString={this.dateInMillisFromString}
      ></TrackingTab>
    ) : null;
  };

  renderPermissionsTab = () => {
    return (
      <PermissionsTab
        projectId={this.props.projectId}
        data={this.props.data}
      ></PermissionsTab>
    );
  };

  renderTab = node => {
    if (this.props.selectedTask !== null && this.state.selectedTab == "data") {
      return this.renderDataTab();
    } else if (this.state.selectedTab == "summary") {
      return this.renderSummaryTab();
    } else if (this.state.selectedTab == "tracking") {
      return this.renderTrackingTab();
    } else if (this.state.selectedTab == "permissions") {
      return this.renderPermissionsTab();
    }
  };

  render() {
    return (
      <Container>
        <TabGroup>
          <Tab onClick={() => this.handleSummaryTabClick()}>Summary</Tab>
          <Tab onClick={() => this.handleDataTabClick()}>Data</Tab>
          <Tab onClick={() => this.handleTrackingTabClick()}>Tracking</Tab>
          <Tab onClick={() => this.handlePermissionsTabClick()}>
            Permissions
          </Tab>
        </TabGroup>
        <TitleContainer>{this.renderTitle()}</TitleContainer>
        <TabContentContainer>{this.renderTab()}</TabContentContainer>
      </Container>
    );
  }

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
}

const Container = styled.div`
    width: 66%
    display: inline-block
`;

const TabGroup = styled.div`
  margin: 16px;
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
  margin: 16px;
`;

const TabContentContainer = styled.div`
  margin: 16px;
`;

export default Tracking;
