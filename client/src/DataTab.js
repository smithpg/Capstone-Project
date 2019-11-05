import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';

function DataTab(props) {

    function renderReviewData() {
        const node = props.retrieveNode(props.data, props.selected);
        return (
            <React.Fragment>
                {node.data.map(datapoint => (
                    <tr key={datapoint.key}>
                        <td>{datapoint.date}</td>
                        <td>{datapoint.username}</td>
                        <td>{datapoint.progress}</td>
                        <td>{datapoint.remaining}</td>
                        <td></td>
                    </tr>
                ))}
            </React.Fragment>
        );
    }

    return (
        <div margin="16px">
            <ComponentHeader>
                <Header>Add Data</Header>
            </ComponentHeader>
            
            <ComponentBody>
                <form onSubmit={props.handleFormSubmit}>
                    <label>Date: </label>
                    <input type="date" value={props.formValues.date} onChange={props.handleDateChange}></input>
                    <br></br>
                    <label>Username: </label>
                    <input type="text" value={props.formValues.username} onChange={props.handleUsernameChange}></input>
                    <br></br>
                    <label>Progress: </label>
                    <input type="number" min="0" value={props.formValues.progress} onChange={props.handleProgressChange}></input>
                    <br></br>
                    <label>Remaining: </label>
                    <input type="number" min="0" value={props.formValues.remaining} onChange={props.handleRemainingChange}></input>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </ComponentBody>

            <br></br>
            
            <ComponentHeader>
                <Header>Review Data</Header>
            </ComponentHeader>
            
            <ComponentBody>
                <table
                    width="100%"
                >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Username</th>
                            <th>Progress</th>
                            <th>Submit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderReviewData()}
                    </tbody>
                </table>
            </ComponentBody>
        </div>
    );
}

const ComponentHeader = styled.div`
    border: solid 1px
    background-color: LightGray
    padding: 8px
    border-top-left-radius: 8px
    border-top-right-radius: 8px
`;

const ComponentBody = styled.div`
    border: solid 1px
    border-top: none
    padding: 8px
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px
`;

const Header = styled.h2`
    margin: 0px
`;

export default DataTab;