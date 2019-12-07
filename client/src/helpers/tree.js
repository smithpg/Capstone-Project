import _ from "lodash";

// const _ = require("lodash");

// const testTree = [{ _id: 1, children: [{ _id: 11, children: [{ _id: 111, children: [] }] }] }, { _id: 2, children: [{ _id: 21, children: [] }, { _id: 22, children: [] }]}, { _id: 3, children: []}]

// function retrieveNode(tree, targetId){

//     console.log("retrieve :: ", tree)

//     function traverse(root) {
//         if (root._id === targetId) {
//             return root;
//         } else if (root.children) {
//             return search(root.children);
//         }

//         return null;
//     }

//     function search(array) {
//         if (!array || array.length < 1 ) return null;
//         for (var i = 0; i < array.length; i++) {
//             const node = traverse(array[i]);
//             if (node != null) {
//                 return node;
//             }
//         }
//     }
//     return search(tree);
// }

// function addNode(tree, node, parentId){

//     const clonedTree = _.cloneDeep(tree);
//     // If this was a top level task
//     if (!parentId) {
//         clonedTree.tree.push(node);
//     } else {
//         const parent = retrieveNode(clonedTree, parentId);

//         parent.children.push(node);
//     }

//     return clonedTree;
// }

// function removeSubtree(tree, nodeId){

//     const clonedTree = _.cloneDeep(tree);

//     for (let topLevelNode of clonedTree){

//         _processNode(topLevelNode);
//     }

//     return clonedTree;

//     function _containsTargetNode(array){
//         return array.some(element => element._id === nodeId)
//     }

//     function _processNode(node){
//         if (_containsTargetNode(node.children)){
//             node.children = node.children.filter(child =>
//                 child._id !== nodeId
//             )
//         }

//         else if (node.children.length > 0) {
//             node.children.forEach(child => _processNode(child))
//         }
//     }
// }

// function editNode(tree, nodeId, update){

//     const targetNode = retrieveNode(tree, nodeId);
//     if (update.parent){
//         // If the node is being moved within the tree
//         const originalParent = retrieveNode(tree, targetNode.parent);
//         originalParent.children = originalParent.children.filter(child => child._id !== nodeId)

//         const newParent = retrieveNode(tree, update.parent);
//         newParent.children.push(targetNode)
//     }

//     Object.assign(targetNode, update);

//     return _.cloneDeep(tree);
// }

export function retrieveNode(tree, targetId) {
  function traverse(root) {
    if (root._id === targetId) {
      return root;
    } else if (root.children) {
      return search(root.children);
    }

    return null;
  }

  function search(array) {
    if (!array || array.length < 1) return null;
    for (var i = 0; i < array.length; i++) {
      console.log(array[i]);

      const node = traverse(array[i]);
      if (node != null) {
        return node;
      }
    }
  }
  return search(tree);
}

export function addNode(tree, node, parentId) {
  const newTree = tree ? _.cloneDeep(tree) : [];
  // If this was a top level task
  if (!parentId) {
    newTree.push(node);
  } else {
    const parent = retrieveNode(newTree, parentId);

    parent.children.push(node);
  }

  return newTree;
}

export function removeSubtree(tree, nodeId) {
  const clonedTree = _.cloneDeep(tree);

  for (let topLevelNode of clonedTree) {
    if (topLevelNode._id === nodeId) {
      return clonedTree.filter(topLevelNode => topLevelNode._id !== nodeId);
    }

    _processNode(topLevelNode);
  }

  return clonedTree;

  function _containsTargetNode(array) {
    return array.some(element => element._id === nodeId);
  }

  function _processNode(node) {
    if (_containsTargetNode(node.children)) {
      node.children = node.children.filter(child => child._id !== nodeId);
    } else if (node.children.length > 0) {
      node.children.forEach(child => _processNode(child));
    }
  }
}

export function editNode(tree, nodeId, update) {
  console.log(arguments);

  const targetNode = retrieveNode(tree, nodeId);
  if (update.parent) {
    // If the node is being moved within the tree
    const originalParent = retrieveNode(tree, targetNode.parent);
    originalParent.children = originalParent.children.filter(
      child => child._id !== nodeId
    );

    const newParent = retrieveNode(tree, update.parent);
    newParent.children.push(targetNode);
  }

  console.log("targetNode", targetNode);

  Object.assign(targetNode, update);
  console.log("targetNode", targetNode);

  return _.cloneDeep(tree);
}
