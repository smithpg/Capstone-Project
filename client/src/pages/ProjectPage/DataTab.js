import React from "react";
import styled from "styled-components";
import { Icon } from "antd";

class DataTab extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      formValues: {
        date: '',
        progress: '',
        remaining: ''
      }
    }
  }

  componentDidMount() {
    this.props.fetchProject()
  }

  renderReviewData = () => {
    if (this.props.selectedTask !== null && this.props.selectedTask !== undefined) {
      return (
        <React.Fragment>
          {this.props.selectedTask.reports.map(datapoint => (
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
  }

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

    fetch('/api/projects/' + this.props.projectId + '/tasks/' + this.props.taskId + '/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: this.props.taskId,
        date: this.state.formValues.date,
        remaining: this.state.formValues.remaining,
        progress: this.state.formValues.progress
      })
    })
    .then(res => {
      console.log(res)
    })
    .then(() => this.props.fetchProject())
    .catch(console.log)

    this.setState({
      formValues: {
        date: '',
        progress: '',
        remaining: ''
      }
    })
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
  handleDeleteTrackingDatapoint = (reportId) => {
    fetch('/api/projects/' + this.props.projectId + '/tasks/' + this.props.taskId + '/reports/' + reportId, {
      method: 'DELETE',
    })
    .then(res => {
      console.log(res)
    })
    .then(() => this.updateData())
    .catch(console.log)
  }
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
