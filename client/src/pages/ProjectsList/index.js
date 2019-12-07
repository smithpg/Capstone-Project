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

  // begin editing item in project tree
  handleEditItemClick = (id, event) => {
    this.setState({
      editing: id
    });

    event.stopPropagation();
  };

  // handle actual editing of item in project tree
  handleEditItem = (id, content, event) => {
    const data = Array.from(this.state.data);
    const node = this.retrieveNode(id, data);
    node.project.title = content;

    this.setState({
      data: data
    });

    event.stopPropagation();
  };

  // handle done editing button
  handleDoneEditingClick = (id, event) => {
    const node = this.retrieveNode(id, this.state.data);
    const newTitle = node.project.title;

    fetch("/api/projects/" + this.state.editing, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTitle
      })
    })
      .then(() => this.fetchProjects())
      .catch(console.log);

    this.setState({
      editing: null
    });
    event.stopPropagation();
  };

  render() {
    return (
      <Container>
        <HeaderContainer>
          <Header>Projects</Header>
        </HeaderContainer>

        <ListContainer>
          {this.state.availableProjects.map(obj => {
            const { project } = obj;

            console.log(this.state.availableProjects);

            console.log(obj.project);
            return (
              <ListItemContainer>
                <li>
                  <ListContentContainer>
                    <Strong>{project.title}</Strong>
                    <IconContainer>
                      <Link to={`/projects/${project._id}`}>View</Link>
                      <Button
                        onClick={e =>
                          this.handleRemoveItemClick(project._id, e)
                        }
                      >
                        X
                      </Button>
                    </IconContainer>
                  </ListContentContainer>
                </li>
              </ListItemContainer>
            );
          })}

          <ListItemContainer>
            <Icon
              type="plus"
              style={{ fontSize: "24px" }}
              onClick={() => this.createNewProject()}
            ></Icon>
          </ListItemContainer>
        </ListContainer>
      </Container>
    );
  }
}

const Container = styled.ul`
  display: inline-block;
  text-align: center;
  width: 100%;
  list-style-type: none;
`;

const HeaderContainer = styled.div`
  text-align: center
  margin: auto;
  width: 33%
`;

const Header = styled.h1`
  margin: 8px;
`;

const Strong = styled.strong``;

const ListContainer = styled.div`
  border-radius: 8px
  background-color: Gray;
  margin: 8px
  width: 50%
  display: inline-block
`;

const ListItemContainer = styled.div`
  border-radius: 8px
  background-color: White
  margin: 8px
  width: 50%
  display: inline-block
`;

const ListContentContainer = styled.div`
  display: flex
  justify-content: space-between
  padding: 4px
`;

const IconContainer = styled.div`
  display: flex;
`;

const Group = styled.div``;

const Button = styled.button`
  margin-left: 4px;
`;

export default ProjectsList;
