const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pms");

const conn = mongoose.connection;

// define the user schema

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },

  email: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },

  password: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});


// make a collection on the schema 

const userModel = mongoose.model('users',schema)

module.exports = userModel