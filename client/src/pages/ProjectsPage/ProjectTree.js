import React from "react";
import { Tree, Icon } from "antd";
import styled from "styled-components";
import "antd/dist/antd.css";
const { TreeNode } = Tree;

function ProjectTree(props) {
  function renderTree(data) {
    return data.map(node => {
      if (node.children && node.children.length) {
        if (props.editing == node.key) {
          return (
            <TreeNode key={node.key} title={renderEditableTreeNode(node)}>
              {renderTree(node.children)}
            </TreeNode>
          );
        } else {
          return (
            <TreeNode key={node.key} title={renderTreeNodeContent(node)}>
              {renderTree(node.children)}
            </TreeNode>
          );
        }
      } else {
        if (props.editing == node.key) {
          return (
            <TreeNode
              key={node.key}
              title={renderEditableTreeNode(node)}
            ></TreeNode>
          );
        } else {
          return (
            <TreeNode
              key={node.key}
              title={renderTreeNodeContent(node)}
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
    return (
      <HeaderContainer>
        <Header>Projects</Header>
        <HeaderIconContainer>
          <Icon
            type="plus"
            style={{ fontSize: "24px" }}
            onClick={() => props.handleAddTopLevelProjectClick()}
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
          {renderTree(props.data)}
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
