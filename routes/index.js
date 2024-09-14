var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome To The Password Manager' });
});

// get the sign up page 

router.get('/signup',(req,res)=>{
  res.render('signup',{title:"Welcome To The Password Manager"})
})

// get the password category page 

router.get('/passwordCategory',(req,res)=>{
  res.render('password_category',{title:"Password Category List"})
})

// get the add new category page 

router.get('/add-new-category',(req,res)=>{
  res.render('add-new-category',{title:"Add new category"})
})

// get the add new password page 

router.get('/add-new-password',(req,res)=>{
  res.render('add-new-password',{title:"Add New Password"})
})


// get the view all passwords page 

router.get('/view-all-password',(req,res)=>{
  res.render('view-all-password',{title:"Password Details List"})
})
module.exports = router;
