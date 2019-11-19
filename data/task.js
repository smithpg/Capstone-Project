const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },

    parent: {
      type: this
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project"
    },

    children: [this],

    reports: [
      {
        type: Schema.Types.ObjectId,
        ref: "Report"
      }
    ]
  },
  { timestamps: true }
);

taskSchema.methods.getFullyPopulatedSubtree = async function() {
  await this.populate("reports");

  // if the task has children ...
  if (this.children) {
    let children = await mongoose // ... retrieve them ...
      .model("Task")
      .find({ parent: this.id });

    children = await Promise.all(
      children.map(child => child.getFullyPopulatedSubtree()) // .. and recurse.
    );

    return {
      ...this._doc,
      children
    };
  } else {
    return this;
  }
};

// taskSchema.pre("find", async function() {
//   // console.log("inside find hook");

//   await this.populate("children reports");
// });

taskSchema.pre("save", async function() {
  if (this.isNew && this.parent) {
    /**
      Add taskId to children array on parent document
    */

    await mongoose.model("Task").findById(this.parent, (err, document) => {
      if (err) {
        console.error(err);
      }

      document.children = [...document.children, this.id];
      document.save();
    });
  }
});

taskSchema.post("remove", async function() {
  /**
  Delete any reports associated with this task
  */
  for (let reportId of this.reports) {
    await mongoose
      .model("Report")
      .findByIdAndRemove(reportId, { useFindAndModify: false });
  }

  /**
  Delete any descendent tasks
  */

  // const children = await mongoose.model("Task").find({ parent: this.id });

  for (let childId of this.children) {
    await mongoose.model("Task").findById(childId, (err, res) => res.remove());
  }
});

module.exports = mongoose.model("Task", taskSchema);
