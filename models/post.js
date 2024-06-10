const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    createdAt: Number,
    updatedAt: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("post", PostSchema);
