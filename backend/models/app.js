const mongoose = require("mongoose");

module.exports = mongoose.model("blog", {
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNum: {
    type: Number,
  },
});
