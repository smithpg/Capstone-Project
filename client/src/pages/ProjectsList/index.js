import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Tree, Icon } from "antd";
import "antd/dist/antd.css";
import ProjectPage from "../ProjectPage";
const { TreeNode } = Tree;


class ProjectsList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      editing: null,
      editedTitle: '',
    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    fetch('/api/projects')
    .then(projects => projects.json())
    .then(projectJson => {
      this.setState({
        data: projectJson
      })
    })
    .catch(console.log)
  }

  renderTree = data => {
    return data.map(node => {
      if (node.project === null) {
        console.log("null node")
        console.log(node)
        return (
          <div></div>
        )
      } else if (this.state.editing === node.project._id) {
        return (
          <TreeNode 
            key={node.project._id} 
            title={this.renderEditableTreeNode(node)}/>
        );
      } else {
        return (
          <TreeNode 
            key={node.project._id} 
            title={this.renderTreeNodeContent(node)}/>
        );
      }
    });
  }

  renderTreeNodeContent = node => {
    return (
      <ItemContainer>
        <Content>{node.project.title}</Content>
        {this.renderIcons(node)}
      </ItemContainer>
    );
  }

  renderEditableTreeNode = node => {
    return (
      <ItemContainer>
        <Group>
          <input
            type="text"
            defaultValue={node.project.title}
            onChange={e => this.handleEditItem(node.project._id, e.target.value, e)}
          ></input>
          <IconContainer>
            <Icon
              type="check"
              onClick={e => this.handleDoneEditingClick(node.project._id, e)}
            ></Icon>
          </IconContainer>
        </Group>
        {this.renderIcons(node)}
      </ItemContainer>
    );
  }

  renderIcons = node => {
    return (
      <Group>
        <IconContainer>
          <Link to={"/projects/" + node.project._id}>
            <Icon
              type="down"
            ></Icon>
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
  }

  renderHeader = () => {
    return (
      <HeaderContainer>
        <Header>Projects</Header>
        <HeaderIconContainer>
          <Icon
            type="plus"
            style={{ fontSize: "24px" }}
            onClick={() => this.handleAddTopLevelProjectClick()}
          ></Icon>
        </HeaderIconContainer>
      </HeaderContainer>
    );
  }

  // add top level project to project tree
  handleAddTopLevelProjectClick = () => {
    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "new content"
      })
    })
    .then(() => this.fetchProjects())
    .catch(console.log)
  }

  // removing project from project tree
  handleRemoveItemClick = (id, event) => {
    event.stopPropagation();

    fetch('/api/projects/' + id, {
      method: 'DELETE'
    })
    .then(() => this.fetchProjects())
    .catch(console.log)
  }

  // return project with given key
  retrieveNode = (id, data) => {
    for (var i = 0; i < data.length; i++) {
      if (id === data[i].project._id) {
        return data[i];
      }
    }
    return null;
  }

  // begin editing item in project tree
  handleEditItemClick = (id, event) => {
    this.setState({
      editing: id
    });

    event.stopPropagation();
  }

  // handle actual editing of item in project tree
  handleEditItem = (id, content, event) => {
    const data = Array.from(this.state.data)
    const node = this.retrieveNode(id, data);
    node.project.title = content
    
    this.setState({
      data: data
    });

    event.stopPropagation();
  }

  // handle done editing button
  handleDoneEditingClick = (id, event) => {
    const node = this.retrieveNode(id, this.state.data)
    const newTitle = node.project.title

    fetch('/api/projects/' + this.state.editing, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTitle
      })
    })
    .then(() => this.fetchProjects())
    .catch(console.log)

    this.setState({
      editing: null
    })
    event.stopPropagation();
  }

  render() {
    return (
      <Container>
        <div>
          {this.renderHeader()}
          <Tree
            blockNode
          >
            {this.renderTree(this.state.data)}
          </Tree>
        </div>
      </Container>
    );
  }
  
}

const Container = styled.div`
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
