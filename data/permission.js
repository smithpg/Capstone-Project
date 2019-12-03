const mongoose = require("mongoose");
const { Schema } = mongoose;

const permissionSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },

    level: {
      type: String,
      enum: ["ADMIN", "EDIT", "COMMENT", "READ"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
