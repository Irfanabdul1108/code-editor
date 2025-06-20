// Update your existing projectModel.js to include document fields
const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Existing code fields
    htmlCode: {
      type: String,
      default: "<h1>Hello world</h1>",
    },
    cssCode: {
      type: String,
      default: "body { background-color: #f4f4f4; }",
    },
    jsCode: {
      type: String,
      default: "// some comment",
    },
    // New document fields
    documentContent: {
      type: String,
      default: "",
    },
    documentTitle: {
      type: String,
      default: "Untitled Document",
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Project", projectSchema)
