import React from "react";
import styled from "styled-components";
import { Icon } from "antd";

import { modifyNode } from "../../helpers/tree";

class DataTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        date: "",
        progress: "",
        remaining: ""
      }
    };
  }

  renderReviewData = () => {
    if (
      this.props.selectedTask !== null &&
      this.props.selectedTask !== undefined
    ) {
      return (
        <React.Fragment>
          {this.props
            .sortTrackingData(this.props.selectedTask.reports)
            .map(datapoint => (
              <tr key={datapoint._id}>
                <td>{datapoint.date}</td>
                <td>{datapoint.username}</td>
                <td>{datapoint.progress}</td>
                <td>{datapoint.remaining}</td>
                <td>
                  <Icon
                    type="delete"
                    onClick={() =>
                      this.handleDeleteTrackingDatapoint(datapoint._id)
                    }
                  ></Icon>
                </td>
              </tr>
            ))}
        </React.Fragment>
      );
    }
  };

  render() {
    return (
      <div margin="16px">
        <ComponentHeader>
          <Header>Add Data</Header>
        </ComponentHeader>

        <ComponentBody>
          <form onSubmit={this.handleFormSubmit}>
            <label>Date: </label>
            <input
              type="date"
              value={this.state.formValues.date}
              onChange={this.handleDateChange}
            ></input>
            <br></br>
            <label>Progress: </label>
            <input
              type="number"
              min="0"
              value={this.state.formValues.progress}
              onChange={this.handleProgressChange}
            ></input>
            <br></br>
            <label>Remaining: </label>
            <input
              type="number"
              min="0"
              value={this.state.formValues.remaining}
              onChange={this.handleRemainingChange}
            ></input>
            <br></br>
            <input type="submit" value="Submit"></input>
          </form>
        </ComponentBody>

        <br></br>

        <ComponentHeader>
          <Header>Review Data</Header>
        </ComponentHeader>

        <ComponentBody>
          <table width="100%">
            <thead>
              <tr>
                <th>Date</th>
                <th>Username</th>
                <th>Progress</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>{this.renderReviewData()}</tbody>
          </table>
        </ComponentBody>
      </div>
    );
  }

  // handle adding data for an item
  handleFormSubmit = event => {
    event.preventDefault();

    const newReport = {
      task: this.props.taskId,
      date: this.state.formValues.date,
      remaining: this.state.formValues.remaining,
      progress: this.state.formValues.progress
    };

    fetch(
      "/api/projects/" +
        this.props.selectedTask.project +
        "/tasks/" +
        this.props.selectedTask._id +
        "/reports/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newReport)
      }
    )
      .then(res => res.json())
      .then(parsedRes => {
        const newTree = modifyNode(
          this.props.projectTree,
          this.props.selectedTask._id,
          node => {
            node.reports = [...node.reports, parsedRes];
          }
        );

        this.props.replaceTree(newTree);
      })
      .then(() => this.setState({}))
      .catch(console.log);

    this.setState({
      formValues: {
        date: "",
        progress: "",
        remaining: ""
      }
    });
  };

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
  };

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
  };

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
  };

  // handle deleting a tracking data point
  handleDeleteTrackingDatapoint = reportId => {
    fetch(
      "/api/projects/" +
        this.props.selectedTask.project +
        "/tasks/" +
        this.props.selectedTask._id +
        "/reports/" +
        reportId,
      {
        method: "DELETE"
      }
    )
      .then(res => {
        console.log(res);
      })
      .then(() => this.updateData())
      .catch(console.log);
  };
}

const ComponentHeader = styled.div`
  border: solid 1px;
  background-color: LightGray;
  padding: 8px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ComponentBody = styled.div`
  border: solid 1px;
  border-top: none;
  padding: 8px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const Header = styled.h2`
  margin: 0px;
`;

export default DataTab;
