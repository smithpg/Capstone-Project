const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    googleId: {
      type: Number,
      unique: true,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.methods.getAccessibleProjects = function() {
  return mongoose
    .model("Permission")
    .find({ user: userDocument.id })
    .populate("project")
    .then(permissionDocuments => {
      return permissionDocuments.map(doc => {
        return { permission: doc.level, project: doc.project };
      });
    });
};

module.exports = mongoose.model("User", userSchema);
