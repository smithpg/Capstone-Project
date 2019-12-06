import React from 'react';
import styled from 'styled-components';
import DataTab from './DataTab'
import SummaryTab from './SummaryTab'
import TrackingTab from './TrackingTab'
import PermissionsTab from './PermissionsTab'

function Tracking(props) {

    const root = props.retrieveNode(props.data, props.project);

    function renderTitle() {
        if (props.selected != null && props.selectedTab != 'permissions') {
            const selected = props.retrieveNode(props.data, props.selected);
            return <h1>{selected.content}</h1>
        }
        return <h1></h1>
    }

    function renderDataTab() {
        return (
            <DataTab
                retrieveNode={props.retrieveNode}
                data={props.data}
                selected={props.selected}
                formValues={props.formValues}
                handleFormSubmit={props.handleFormSubmit}
                handleDateChange={props.handleDateChange}
                handleUsernameChange={props.handleUsernameChange}
                handleProgressChange={props.handleProgressChange}
                handleRemainingChange={props.handleRemainingChange}
                handleDeleteTrackingDatapoint={props.handleDeleteTrackingDatapoint}
                dateInMillisFromString={props.dateInMillisFromString}
            ></DataTab>
        );
    }

    function renderSummaryTab() {
        if (props.selected != null) {
            return (
                <SummaryTab
                    data={props.data}
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

    function renderTrackingTab() {
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
            return (<React.Fragment></React.Fragment>)
        }
        
    }

    function renderPermissionsTab() {
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

    function renderTab(node) {

        if (props.selected != null && props.selectedTab == 'data') {
            return renderDataTab();
        } else if (props.selectedTab == 'summary') {
            return renderSummaryTab();
        } else if (props.selectedTab == 'tracking') {
            return renderTrackingTab();
        } else if (props.selectedTab == 'permissions') {
            return renderPermissionsTab();
        }
    }

    return (
        <Container>
            <TabGroup>
                <Tab
                    onClick={() => props.handleSummaryTabClick()}
                >Summary</Tab>
                <Tab
                    onClick={() => props.handleDataTabClick()}
                >Data</Tab>
                <Tab
                    onClick={() => props.handleTrackingTabClick()}
                >Tracking</Tab>
                <Tab
                    onClick={() => props.handlePermissionsTabClick()}
                >Permissions</Tab>
            </TabGroup>
            <TitleContainer>
                {renderTitle()}
            </TitleContainer>
            <TabContentContainer>
                {renderTab()}
            </TabContentContainer>
        </Container>
    );
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