const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = Schema(
  {
    title: {
      type: String,
      required: true
    },

    parent: {
      type: this,
      set: function(newParentId) {
        // store the previous parent's id when updating `parent` field
        this._previousParent = this.parent;

        return newParentId;
      }
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
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
  } else if (this.parent && this.isModified("parent")) {
    // If the parent property has been modified, this means the
    // task has been relocated within the tree; so we need to
    // remove this task from the `children` array of the previous parent ...

    await mongoose
      .model("Task")
      .findById(this._previousParent, (err, document) => {
        if (err) {
          console.error(err);
        }

        document.children = [
          ...document.children.filter(childId => childId !== this.id)
        ];

        document.save();
      });

    // ... and add it to the `children` array of the new one.
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

  for (let childId of this.children) {
    await mongoose.model("Task").findById(childId, (err, res) => res.remove());
  }
});

module.exports = mongoose.model("Task", taskSchema);
