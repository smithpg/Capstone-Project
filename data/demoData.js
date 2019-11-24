const { Task, connection } = require("./index");
const sampleData = require("./sampleData");

Task.create({ title: "testin" });

async function createDocuments(data) {
  const queue = [];
  console.log(data);
  function addChildrenToQueue(parentId, childrenArray) {
    childrenArray.forEach(node => queue.unshift([node, parentId]));
  }

  async function processNode(node, parentId) {
    console.log(node, parentId);
    const { _id } = await Task.create({
      title: node.title,
      parent: parentId
    });

    addChildrenToQueue(_id, node.nodes);
  }

  addChildrenToQueue(null, data);

  while (queue.length > 0) {
    await processNode(...queue.pop());
  }
}

connection.then(() => createDocuments(sampleData));
