const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task" },

    date: Date,

    remaining: Number,

    progress: Number
  },
  { timestamps: true }
);

reportSchema.pre("save", function(next) {
  if (this.isNew) {
    mongoose.model("Task").findById(this.task, (err, affectedTask) => {
      affectedTask.reports.push(this._id);
      affectedTask.save((err, res) => {
        if (err) console.error(err);
      });
    });
  }

  next();
});

reportSchema.post("remove", function(next) {
  mongoose.model("Task").findById(this.task, (err, affectedTask) => {
    affectedTask.reports = affectedTask.reports.filter(
      reportId => reportId !== this.id
    );
    affectedTask.save((err, res) => {
      if (err) console.error(err);
    });
  });
});

module.exports = mongoose.model("Report", reportSchema);
