const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pms");

const conn = mongoose.connection;

// define the password category schema

const schema = new mongoose.Schema({
  password_category: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  date: {
    type: Date,
    default: Date.now(),
  }
});


// making an model of this schema 

const passCatModel = mongoose.model('password_category',schema)


module.exports = passCatModel