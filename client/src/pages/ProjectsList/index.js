import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "antd";
import "antd/dist/antd.css";

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableProjects: [],
      editing: null,
      editedTitle: ""
    };
  }

  componentDidMount() {
    fetch("/api/projects")
      .then(projects => projects.json())
      .then(projectJson => {
        console.log(projectJson);

        this.setState({
          availableProjects: projectJson
        });
      })
      .catch(console.log);
  }

  renderIcons = node => {
    return (
      <Group>
        <IconContainer>
          <Link to={"/projects/" + node.project._id}>
            <button>View Project</button>
          </Link>
        </IconContainer>

        <IconContainer>
          <Icon
            type="edit"
            onClick={e => this.handleEditItemClick(node.project._id, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="delete"
            onClick={e => this.handleRemoveItemClick(node.project._id, e)}
          ></Icon>
        </IconContainer>
      </Group>
    );
  };

  // add top level project to project tree
  createNewProject = () => {
    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "new content"
      })
    })
      .then(res => res.json())
      .then(newProject =>
        this.setState({
          availableProjects: [...this.state.availableProjects, newProject]
        })
      )
      .catch(console.log);
  };

  // removing project from project tree
  handleRemoveItemClick = (id, event) => {
    fetch("/api/projects/" + id, {
      method: "DELETE"
    })
      .then(
        res =>
          res.status === 204 &&
          this.setState({
            availableProjects: this.state.availableProjects.filter(
              obj => obj.project._id !== id
            )
          })
      )
      .catch(console.log);
  };

  // // begin editing item in project tree
  // handleEditItemClick = (id, event) => {
  //   this.setState({
  //     editing: id
  //   });

  //   event.stopPropagation();
  // };

  // // handle actual editing of item in project tree
  // handleEditItem = (id, content, event) => {
  //   const data = Array.from(this.state.data);
  //   const node = this.retrieveNode(id, data);
  //   node.project.title = content;

  //   this.setState({
  //     data: data
  //   });

  //   event.stopPropagation();
  // };

  // // handle done editing button
  // handleDoneEditingClick = (id, event) => {
  //   const node = this.retrieveNode(id, this.state.data);
  //   const newTitle = node.project.title;

  //   fetch("/api/projects/" + this.state.editing, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       title: newTitle
  //     })
  //   })
  //     .then(() => this.fetchProjects())
  //     .catch(console.log);

  //   this.setState({
  //     editing: null
  //   });
  //   event.stopPropagation();
  // };

  render() {
    return (
      <Container>
        <HeaderContainer>
          <Header>Projects</Header>
          <HeaderIconContainer>
            <Icon
              type="plus"
              style={{ fontSize: "24px" }}
              onClick={() => this.createNewProject()}
            ></Icon>
          </HeaderIconContainer>
        </HeaderContainer>

        {this.state.availableProjects.map(obj => {
          const { project } = obj;

          console.log(this.state.availableProjects);

          console.log(obj.project);
          return (
            <li>
              <strong>{project.title}d</strong>
              <Link to={`/projects/${project._id}`}>View</Link>
              <button onClick={e => this.handleRemoveItemClick(project._id, e)}>
                X
              </button>
            </li>
          );
        })}
      </Container>
    );
  }
}

const Container = styled.ul`
  float: left;
  width: 33%;
  overflow-y: scroll;
  height: 100vh;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeaderIconContainer = styled.div`
  margin: 8px;
  margin-top: 16px;
`;

const Header = styled.h1`
  margin: 8px;
  margin-left: 24px;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IconContainer = styled.div`
  margin-left: 8px;
`;

const Group = styled.div`
  display: flex;
`;

const Content = styled.div``;

export default ProjectsList;
