import React from "react";
import { Tree, Icon } from "antd";
import styled from "styled-components";
import "antd/dist/antd.css";
const { TreeNode } = Tree;

function ProjectTree(props) {

  function renderTree(node) {
    return node.children.map(child => {
      if (child.children && child.children.length) {
        if (props.editing == child.key) {
          return (
            <TreeNode key={child.key} title={renderEditableTreeNode(child)}>
              {renderTree(child)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode key={child.key} title={renderTreeNodeContent(child)}>
              {renderTree(child)}
            </TreeNode>
          );
        }
      } else {
        if (props.editing == child.key) {
          return (
            <TreeNode
              key={child.key}
              title={renderEditableTreeNode(child)}
            ></TreeNode>
          );
        } else {
          return (
            <TreeNode
              key={child.key}
              title={renderTreeNodeContent(child)}
            ></TreeNode>
          );
        }
      }
    });
  }

  function renderTreeNodeContent(node) {
    return (
      <ItemContainer>
        <Content>{node.content}</Content>
        {renderIcons(node)}
      </ItemContainer>
    );
  }

  function renderEditableTreeNode(node) {
    return (
      <ItemContainer>
        <Group>
          <input
            type="text"
            defaultValue={node.content}
            onChange={e => props.handleEditItem(node.key, e.target.value, e)}
          ></input>
          <IconContainer>
            <Icon
              type="check"
              onClick={e => props.handleDoneEditingClick(e)}
            ></Icon>
          </IconContainer>
        </Group>
        {renderIcons(node)}
      </ItemContainer>
    );
  }

  function renderIcons(node) {
    return (
      <Group>
        <IconContainer>
          <Icon
            type="plus"
            onClick={e => props.handleAddChildClick(node.key, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="edit"
            onClick={e => props.handleEditItemClick(node.key, e)}
          ></Icon>
        </IconContainer>

        <IconContainer>
          <Icon
            type="delete"
            onClick={e => props.handleRemoveItemClick(node.key, e)}
          ></Icon>
        </IconContainer>
      </Group>
    );
  }

  function renderHeader() {

    const node = props.retrieveNode(props.data, props.project);

    return (
      <HeaderContainer>
        <Header>{node.content}</Header>
        <HeaderIconContainer>
          <Icon
            type="plus"
            style={{ fontSize: "24px" }}
            onClick={() => props.handleAddTopLevelProjectItemClick(props.project)}
          ></Icon>
        </HeaderIconContainer>
      </HeaderContainer>
    );
  }

  return (
    <Container>
      <div>
        {renderHeader()}
        <Tree
          blockNode
          draggable={true}
          onDrop={props.onDrop}
          onSelect={props.onSelect}
        >
          {renderTree(props.retrieveNode(props.data, props.project))}
        </Tree>
      </div>
    </Container>
  );
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
