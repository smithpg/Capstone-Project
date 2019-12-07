import React from "react";
import { Tree, Icon } from "antd";
import styled from "styled-components";
import "antd/dist/antd.css";
const { TreeNode } = Tree;

class ProjectTree extends React.Component {

  constructor(props) {
    super(props)
    this.state={
      editing: null,
      project: null,
      task: null
    }
  }

  componentDidMount() {
    this.props.fetchProject();
  }

  render() {
    return (
      <Container>
        <div>
          {this.renderHeader()}
          <Tree
            blockNode
            draggable={false}
            //onDrop={this.onDrop}
            onSelect={this.props.onSelect}
          >
            {this.renderTree(this.props.selectedProject)}
          </Tree>
        </div>
      </Container>
    );
  }

  renderTree = node => {
    if (node != null) {
      if (node.tree) {
        return node.tree.map(child => {
          if (child.children && child.children.length) {
            if (this.state.editing === child._id) {
              return (
                <TreeNode key={child._id} title={this.renderEditableTreeNode(child)}>
                  {this.renderTree(child)}
                </TreeNode>
              );
            } else {
              return (
                <TreeNode key={child._id} title={this.renderTreeNodeContent(child)}>
                  {this.renderTree(child)}
                </TreeNode>
              );
            }
          } else {
            if (this.state.editing === child._id) {
              return (
                <TreeNode
                  key={child._id}
                  title={this.renderEditableTreeNode(child)}
                ></TreeNode>
              );
            } else {
              return (
                <TreeNode
                  key={child._id}
                  title={this.renderTreeNodeContent(child)}
                ></TreeNode>
              );
            }
          }
        });
      } else {
        return node.children.map(child => {
          if (child.children && child.children.length) {
            if (this.state.editing === child._id) {
              return (
                <TreeNode key={child._id} title={this.renderEditableTreeNode(child)}>
                  {this.renderTree(child)}
                </TreeNode>
              );
            } else {
              return (
                <TreeNode key={child._id} title={this.renderTreeNodeContent(child)}>
                  {this.renderTree(child)}
                </TreeNode>
              );
            }
          } else {
            if (this.state.editing === child._id) {
              return (
                <TreeNode
                  key={child._id}
                  title={this.renderEditableTreeNode(child)}
                ></TreeNode>
              );
            } else {
              return (
                <TreeNode
                  key={child._id}
                  title={this.renderTreeNodeContent(child)}
                ></TreeNode>
              );
            }
          }
        });
      }
      
    }
  }

  renderTreeNodeContent = node => {
    return (
      <ItemContainer>
        <Content>{node.title}</Content>
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
            defaultValue={node.title}
            onChange={e => this.handleEditItem(node._id, e.target.value, e)}
          ></input>
          <IconContainer>
            <Icon
              type="check"
              onClick={e => this.handleDoneEditingClick(node._id, e)}
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
          <Icon
            type="plus"
            onClick={e => this.handleAddChildClick(node._id, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="edit"
            onClick={e => this.handleEditItemClick(node._id, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="delete"
            onClick={e => this.handleRemoveItemClick(node._id, e)}
          ></Icon>
        </IconContainer>
      </Group>
    );
  }

  renderHeader = ()  => {
    if (this.props.selectedProject !== null) {
      return (
        <HeaderContainer>
          <Header>{this.props.selectedProject.title}</Header>
          <HeaderIconContainer>
            <Icon
              type="plus"
              style={{ fontSize: "24px" }}
              onClick={() => this.handleAddTopLevelProjectItemClick()}
            ></Icon>
          </HeaderIconContainer>
        </HeaderContainer>
      );
    }
  }

  // return task with given key
  retrieveNode = (id) => {

    function traverse(root) {
      console.log(root)
      if (root === null) {
        return null;
      } else if (root._id === id) {
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

    return search(this.props.selectedProject.tree);
  }

  // add top level task to project tree
  handleAddTopLevelProjectItemClick = () => {
    fetch('/api/projects/' + this.props.projectId +'/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "new content",

      })
    })
    .then(res => console.log(res))
    .then(() => this.props.fetchProject())
  }

  // adding child to a project tree item
  handleAddChildClick = (parentId, event) => {
    fetch('/api/projects/' + this.props.projectId +'/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "new content",
        parent: parentId
      })
    })
    .then(res => console.log(res))
    .then(() => this.props.fetchProject())

    event.stopPropagation();
  }

  // removing project from project tree
  handleRemoveItemClick = (id, event) => {
    fetch('/api/projects/' + this.props.projectId + '/tasks/' + id, {
      method: "DELETE"
    })
    .then(() => this.props.fetchProject())
    .catch(console.log)

    event.stopPropagation();
  }

  // begin editing item in project tree
  handleEditItemClick = (id, event) => {
    const node = this.retrieveNode(id);

    this.setState({
      editing: id,
      task: node
    });
    event.stopPropagation();
  }

  // handle actual editing of item in project tree
  handleEditItem = (id, content, event) => {
    this.setState((state, props) => {
      var updated = Object.assign({}, state.task)
      updated.title = content
      return {task: updated}
    })

    event.stopPropagation();
  }

  // handle done editing button
  handleDoneEditingClick = (id, event) => {
    fetch('/api/projects/' + this.props.projectId +'/tasks/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.task.title,
      })
    })
    .then(res => console.log(res))
    .then(() => this.props.fetchProject())

    this.setState({
      editing: null,
      task: null
    })

    event.stopPropagation();
  }

  /*
  // on dropping a project in the tree into a new position
  onDrop = (event) => {
    console.log("on drop")

    const dragKey = event.dragNode.props.eventKey;
    const dropKey = event.node.props.eventKey;
    const dropPosition = event.dropPosition;

    const dragNode = this.retrieveNode(dragKey);
    console.log(dragNode)
    const dropIndex = this.indexOf(this.state.project.tree, dropKey);
    console.log(dropIndex)

    this.insertNode(dragNode, dropKey, dropPosition, dropIndex, this.updateParent);
  }
  */

  // return index of a project given its key within its parent's array
  indexOf = (data, key) => {

    for (var i = 0; i < data.length; i++) {
      if (data[i].key == key) {
        return i;
      }
      const index = this.indexOf(data[i].children, key);
      if (index != -1) {
        return index;
      }
    }
    return -1;
  }

  updateParent = (node, parent) => {
    console.log('update parent')
    console.log(node)
    console.log(parent)
    fetch('/api/projects/' + this.props.id +'/tasks/' + node._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: this.state.task.title,
        parent: parent._id
      })
    })
    .then(res => console.log(res))
    .then(() => this.fetchProject())
    .catch(console.log)
  }

  // insert node into project tree
  insertNode = (dragNode, dropKey, dropPosition, dropIndex, updateParent) => {

    function traverse(root) {
      if (root === null) {
        return;
      } else {
        search(root.children, root);
      }
    }

    function search(array, parent) {
      for (var i = 0; i < array.length; i++) {
        if (array[i]._id === dropKey) {
          if (dropPosition === dropIndex - 1) {
            updateParent(dragNode, parent)
            //array.splice(i, 0, dragNode);
          } else if (dropPosition === dropIndex + 1) {
            //array.splice(i + 1, 0, dragNode);
            updateParent(dragNode, parent)
          } else {
            //array[i].children.splice(array[i].children.length, 0, dragNode);
            updateParent(dragNode, array[i])
          }
            return;
        }
        traverse(array[i]);
      }    
    }

    search(this.state.project.tree, null)
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

export default ProjectTree;
