const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/pms')

const conn = mongoose.connection


// schema for the password category 
const schema = new mongoose.Schema({

    password_category:{
        type:String,
        requried:true,
    },

    project_name:{
        type:String,
        requried:true,
        index:{
            unique:true
        }
    },
    password_desc:{
        type:String,
        requried:true,
    },
    
    date: {
        type: Date,
        default: Date.now(),
      },
})


// making model on this schema 

const passDescModel = mongoose.model('password_description',schema)


// export the model 

module.exports = passDescModel