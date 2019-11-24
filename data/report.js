const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = Schema(
  {
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },

    date: { type: Date, required: true },

    remaining: { type: Number, required: true },

    progress: { type: Number, required: true }
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
