import React from "react";
import styled from "styled-components";
import ProjectTree from "./ProjectTree"
import Tracking from "./Tracking"

function ProjectPage(props) {
  return (
    <AppContainer>
      <ProjectTree
        onDrop={props.onDrop}
        onSelect={props.onSelect}
        handleAddChildClick={props.handleAddChildClick}
        handleRemoveItemClick={props.handleRemoveItemClick}
        handleEditItemClick={props.handleEditItemClick}
        handleEditItem={props.handleEditItem}
        handleDoneEditingClick={props.handleDoneEditingClick}
        handleAddTopLevelProjectItemClick={props.handleAddTopLevelProjectItemClick}
        data={props.data}
        editing={props.editing}
        project={parseInt(props.match.params.projectId)}
        retrieveNode={props.retrieveNode}
      >
      </ProjectTree>
      <Tracking
        selected={props.selected}
        data={props.data}
        retrieveNode={props.retrieveNode}
        formValues={props.formValues}
        selectedTab={props.selectedTab}
        handleSummaryTabClick={props.handleSummaryTabClick}
        handleDataTabClick={props.handleDataTabClick}
        handleTrackingTabClick={props.handleTrackingTabClick}
        handlePermissionsTabClick={props.handlePermissionsTabClick}
        handleFormSubmit={props.handleFormSubmit}
        handleDateChange={props.handleDateChange}
        handleUsernameChange={props.handleUsernameChange}
        handleProgressChange={props.handleProgressChange}
        handleRemainingChange={props.handleRemainingChange}
        handleDeleteTrackingDatapoint={props.handleDeleteTrackingDatapoint}
        calculateSummaryData={props.calculateSummaryData}
        allDataPointsForNode={props.allDataPointsForNode}
        dateInMillisFromString={props.dateInMillisFromString}
        retrieveRoot={props.retrieveRoot}
        handlePermissionFormSubmit={props.handlePermissionFormSubmit}
        handleUsernamePermChange={props.handleUsernamePermChange}
        handleReadPermissionChange={props.handleReadPermissionChange}
        handleWritePermissionChange={props.handleWritePermissionChange}
        handleDeleteReadPermission={props.handleDeleteReadPermission}
        handleDeleteWritePermission={props.handleDeleteWritePermission}
        project={parseInt(props.match.params.projectId)}
      >
      </Tracking>
    </AppContainer>
  );  
}


const AppContainer = styled.div`
  width: 100%
  display: inline-block
`;

export default ProjectPage;
