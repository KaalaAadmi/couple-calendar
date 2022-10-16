const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  start: {
    type: Date,
    required: [true],
  },
  end: {
    type: Date,
    required: [true],
  },
  allDay: {
    type: Boolean,
  },
  colorEvent: {
    type: String,
  },
  color: {
    type: String,
  },
});

module.exports = mongoose.model("Data", dataSchema);
