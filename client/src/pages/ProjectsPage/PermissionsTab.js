import React from 'react';
import styled from 'styled-components';
import { Icon } from 'antd';

function PermissionsTab(props) {

    function renderReadPermissionsData() {
        const node = props.retrieveRoot(props.data, props.selected);
        console.log(props.formValues)
        return (
            <React.Fragment>
                {node.readPermissions.map(user => (
                    <tr key={user}>
                        <td>{user}</td>
                        <td>
                            <Icon 
                                type="delete"
                                onClick={() => props.handleDeleteReadPermission(node.key, user)}
                            ></Icon>
                        </td>
                    </tr>
                ))}
            </React.Fragment>
        );
    }

    function renderWritePermissionsData() {
        const node = props.retrieveRoot(props.data, props.selected);
        console.log(props.formValues)
        return (
            <React.Fragment>
                {node.writePermissions.map(user => (
                    <tr key={user}>
                        <td>{user}</td>
                        <td>
                            <Icon 
                                type="delete"
                                onClick={() => props.handleDeleteWritePermission(node.key, user)}
                            ></Icon>
                        </td>
                    </tr>
                ))}
            </React.Fragment>
        );
    }
    return (
        <div margin="16px">
            <ComponentHeader>
                <Header>Add Permissions</Header>
            </ComponentHeader>
            
            <ComponentBody>
                <form onSubmit={props.handlePermissionFormSubmit}>
                    <label>Username: </label>
                    <input type="text" value={props.formValues.usernamePerm} onChange={props.handleUsernamePermChange}></input>
                    <br></br>
                    <label>Read: </label>
                    <input type="checkbox" checked={props.formValues.read} onChange={props.handleReadPermissionChange}></input>
                    <br></br>
                    <label>Write: </label>
                    <input type="checkbox" checked={props.formValues.write} onChange={props.handleWritePermissionChange}></input>
                    <br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </ComponentBody>

            <br></br>
            
            <ComponentHeader>
                <Header>Read Permissions</Header>
            </ComponentHeader>
            
            <ComponentBody>
                <table
                    width="100%"
                >
                    <thead>
                        <tr>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderReadPermissionsData()}
                    </tbody>
                </table>
            </ComponentBody>

            <br></br>

            <ComponentHeader>
                <Header>Write Permissions</Header>
            </ComponentHeader>
            
            <ComponentBody>
                <table
                    width="100%"
                >
                    <thead>
                        <tr>
                            <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderWritePermissionsData()}
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

export default PermissionsTab;