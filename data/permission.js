const mongoose = require("mongoose");
const { Schema } = mongoose;

const permissionSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },

    level: {
      type: String,
      enum: ["ADMIN", "EDIT", "COMMENT", "READ"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
