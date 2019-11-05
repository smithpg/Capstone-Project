import React from 'react';
import styled from 'styled-components';
import DataTab from './DataTab'
import SummaryTab from './SummaryTab'

function Tracking(props) {

    function renderTitle() {
        if (props.selected != null) {
            const node = props.retrieveNode(props.data, props.selected);
            return <h1>{node.content}</h1>
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
            ></DataTab>
        );
    }

    function renderSummaryTab() {
        return (
            <SummaryTab
                data={props.data}
                selected={props.selected}
                calculateSummaryData={props.calculateSummaryData}
                retrieveNode={props.retrieveNode}
            ></SummaryTab>
        )
    }

    function renderTab() {
        if (props.selected != null) {
            if (props.selectedTab == 'data') {
                return renderDataTab();
            } else if (props.selectedTab == 'summary') {
                return renderSummaryTab();
            }
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
    border: solid gray 1px
    background: none
    border-radius: 8px
    margin: 2px
`;

const TitleContainer = styled.div`
    margin: 16px
`;

const TabContentContainer = styled.div`
    margin: 16px
`;

export default Tracking;