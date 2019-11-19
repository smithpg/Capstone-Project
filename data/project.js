const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },

    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }]
  },
  { timestamps: true }
);

projectSchema.methods.generateProjectTree = async function() {
  const tasks = await mongoose
    .model("Task")
    .find({ project: this.id })
    .populate("reports")
    .lean();

  return assembleTree(tasks);
};

projectSchema.post("remove", async function(next) {
  /**
    Delete any tasks associated with this project
    */
  await mongoose.model("Task").deleteMany({ project: this.id });
});

module.exports = mongoose.model("Project", projectSchema);

function assembleTree(tasks) {
  // Take all the tasks that compose a project and
  // piece them together into tree structure

  taskIndex = tasks.reduce((accum, task) => {
    accum[task._id] = task;
    return accum;
  }, {});

  return tasks.filter(task => task.parent == null).map(_populateTask);

  function _populateTask(task) {
    if (task.children.length === 0) return task;

    return {
      ...task,
      children: task.children.map(childId =>
        _populateTask(_getTaskById(childId))
      )
    };
  }

  function _getTaskById(id) {
    return taskIndex[id];
  }
}
