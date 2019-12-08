import React, { Component } from "react";
import styled from "styled-components";
import { Icon } from "antd";

export default class PermissionsTab extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", permissionLevel: "READ", permissions: [] };
  }

  componentDidMount() {
    fetch("/api/projects/" + this.props.projectId + "/permissions")
      .then(res => res.json())
      .then(parsed =>
        this.setState({ permissions: parsed }, () => console.log(this.state))
      );
  }

  renderReadPermissionsData() {
    return (
      <React.Fragment>
        {this.state.permissions
          .filter(permission => permission.level === "READ")
          .map(permission => (
            <tr key={permission._id}>
              <td>{permission.user.email}</td>
              <td>
                <Icon
                  type="delete"
                  onClick={() => this.handleDeletePermission(permission._id)}
                ></Icon>
              </td>
            </tr>
          ))}
      </React.Fragment>
    );
  }

  renderWritePermissionsData() {
    return (
      <React.Fragment>
        {this.state.permissions
          .filter(permission => permission.level === "EDIT")
          .map(permission => (
            <tr key={permission._id}>
              <td>{permission.user.email}</td>
              <td>
                <Icon
                  type="delete"
                  onClick={() => this.handleDeletePermission(permission._id)}
                ></Icon>
              </td>
            </tr>
          ))}
      </React.Fragment>
    );
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submit = e => {
    e.preventDefault();
    this.handlePermissionFormSubmit();
  };

  handlePermissionFormSubmit = () => {
    fetch("/api/projects/" + this.props.projectId + "/permissions/", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: this.state.email,
        permissionLevel: this.state.permissionLevel
      })
    })
      .then(res => res.json())
      .then(parsedRes => {
        this.setState(
          {
            permissions: [...this.state.permissions, parsedRes]
          },
          () => console.log(this.state)
        );
      });
  };

  handleDeletePermission = id => {
    fetch("/api/projects/" + this.props.projectId + "/permissions/" + id, {
      method: "delete"
    }).then(() => {
      this.setState({
        permissions: this.state.permissions.filter(p => p._id != id)
      });
    });
  };

  render() {
    return (
      <div margin="16px">
        <ComponentHeader>
          <Header>Add Permissions</Header>
        </ComponentHeader>

        <ComponentBody>
          <form onSubmit={this.submit}>
            <label>Email: </label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            ></input>
            <br></br>
            <select
              name="permissionLevel"
              value={this.state.permissionLevel}
              onChange={this.onChange}
            >
              <option value={"READ"}>READ</option>
              <option value={"EDIT"}>EDIT</option>
            </select>
            <input type="submit" value="Submit"></input>
          </form>
        </ComponentBody>

        <br></br>

        <ComponentHeader>
          <Header>Read Permissions</Header>
        </ComponentHeader>

        <ComponentBody>
          <table width="100%">
            <thead>
              <tr>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>{this.renderReadPermissionsData()}</tbody>
          </table>
        </ComponentBody>

        <br></br>

        <ComponentHeader>
          <Header>Write Permissions</Header>
        </ComponentHeader>

        <ComponentBody>
          <table width="100%">
            <thead>
              <tr>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>{this.renderWritePermissionsData()}</tbody>
          </table>
        </ComponentBody>
      </div>
    );
  }
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
  margin: 0px;
`;
