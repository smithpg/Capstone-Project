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

    };
  }

  componentDidMount() {
    this.fetchProjects();
  }

  fetchProjects = () => {
    fetch('/api/projects')
    .then(projects => {
      console.log('here')
      console.log(projects.json())
      this.setState({
        data: projects.json()
      })
    })
    .catch(console.log)
  }

  renderTree = data => {
    return data.map(node => {
      if (node.children && node.children.length) {
        if (this.state.editing.editing == node.key) {
          return (
            <TreeNode key={node.key} title={this.renderEditableTreeNode(node)}>
              {this.renderTree(node.children)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode key={node.key} title={this.renderTreeNodeContent(node)}>
              {this.renderTree(node.children)}
            </TreeNode>
          );
        }
      } else {
        if (this.state.editing == node.key) {
          return (
            <TreeNode
              key={node.key}
              title={this.renderEditableTreeNode(node)}
            ></TreeNode>
          );
        } else {
          return (
            <TreeNode
              key={node.key}
              title={this.renderTreeNodeContent(node)}
            ></TreeNode>
          );
        }
      }
    });
  }

  renderTreeNodeContent = node => {
    return (
      <ItemContainer>
        <Content>{node.content}</Content>
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
            defaultValue={node.content}
            onChange={e => this.handleEditItem(node.key, e.target.value, e)}
          ></input>
          <IconContainer>
            <Icon
              type="check"
              onClick={e => this.handleDoneEditingClick(e)}
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
          <Link to={"/projects/" + node.key}>
            <Icon
              type="down"
            ></Icon>
          </Link>
        </IconContainer>

        <IconContainer>
          <Icon
            type="edit"
            onClick={e => this.handleEditItemClick(node.key, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="delete"
            onClick={e => this.handleRemoveItemClick(node.key, e)}
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

  // return project with given key
  retrieveNode = (data, key) => {

    function traverse(root) {
      if (root === null) {
        return null;
      } else if (root.key == key) {
        return root;
      } else {
        return search(root.children);
      }
    }

    function search(array) {
      for (var i = 0; i < array.length; i++) {
        const node = traverse(array[i]);
        if (node != null) {
          return node;
        }
      }
      return null;
    }

    return search(data);
  }

  // removing project from project tree
  handleRemoveItemClick = (key, event) => {
    var data = Array.from(this.state.data);
    this.removeNode(data, key);

    var selected;
    if (this.state.selected == key) {
      const selected = this.state.selected == key ? null : this.state.selected;
    }
    
    this.setState({
      data: data,
      selected: selected == key ? null : selected
    });

    event.stopPropagation();
  }

  // begin editing item in project tree
  handleEditItemClick = (key, event) => {
    this.setState({
      editing: key
    });
    event.stopPropagation();
  }

  // handle actual editing of item in project tree
  handleEditItem = (key, content, event) => {
    var data = Array.from(this.state.data);
    
    const node = this.retrieveNode(data, key);
    node.content = content;
    
    this.setState({
      data: data
    });

    event.stopPropagation();
  }

  // handle done editing button
  handleDoneEditingClick = (event) => {
    this.setState({
      editing: null
    })
    event.stopPropagation();
  }

  // add top level project to project tree
  handleAddTopLevelProjectClick = () => {
    var data = Array.from(this.state.data);

    console.log("click")
    
    const newNode = {
      key: Math.floor(Math.random()*1000), 
      content: "new content", 
      children: [], 
      data: [],
      readPermissions: [],
      writePermissions: [],
    };
    data.splice(data.length, 0, newNode);

    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "new content"
      })
    })
    
    this.fetchProjects();
  }

  // remove project with given key from project tree
  removeNode = (data, key) => {

    function traverse(root) {
      if (root === null) {
        return null;
      } else {
        search(root.children);
      }
    }

    function search(array) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].key == key) {
          array.splice(i, 1);
          return;
        }
        const node = traverse(array[i]);
        if (node != null) {
          return;
        }
      }  
    }

    search(data);      
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
