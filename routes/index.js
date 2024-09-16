var express = require("express");
var router = express.Router();
const userModel = require("../modules/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); // for password encryption
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const passCatModel = require("../modules/password_category");

// for temprary store the message to send through the redirecting 

const session = require('express-session');
const flash = require('connect-flash');


// Set up session middleware
router.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true
}));

// Set up flash middleware
router.use(flash());

// set up the node local storage for authetication
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

// middleware to check the username already exits in database or not

const validateUsername = async function (req, res, next) {
  // get the username
  const username = req.body.uname;

  // check this uname exits in database or not
  try {
    const response = await userModel.findOne({ username: username }).exec();
    if (response) {
      return res.render("signup", {
        title: "Welcome To The Password Manager",
        msg: "Username Already Exits",
      });
    }
  } catch (error) {
    throw error;
  }

  next();
};

// middleware to check the email already exits in database or not

const validateEmail = async function (req, res, next) {
  // get the username
  const email = req.body.email;

  // check this uname exits in database or not
  try {
    const response = await userModel.findOne({ email: email }).exec();
    if (response) {
      return res.render("signup", {
        title: "Welcome To The Password Manager",
        msg: "Email Already Exits",
      });
    }
  } catch (error) {
    throw error;
  }

  next();
};

//middleware to check the user is login or not for every route

function validateLogin(req, res, next) {
  //get the jwt token from the database
  const token = localStorage.getItem("userToken");

  try {
    jwt.verify(token, "secret-key");
  } catch (error) {
    return res.redirect("/");
  }
  next();
}

//middleware to check whether the password category exits in the database or not

async function validatePasswordCategory(req, res, next) {
  // get the password category
  const passCatg = req.body.newcatg;

  // find the catg from db
  try {
    const response = await passCatModel.findOne({
      password_category: passCatg,
    });

    // if the category is found in database
    if (response) {
      let currUser = localStorage.getItem("currentUser");
      return res.render("add-new-category", {
        title: "Add new category",
        currUser: currUser,
        error: null,
        msg: "Password Category Exits Already",
      });
    }
  } catch (error) {
    throw error;
  }

  next();
}

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Welcome To The Password Manager", msg: "" });
});

// handle the post request on the login page
router.post("/", async (req, res) => {
  // get the data from login form
  const username = req.body.uname;
  const password = req.body.password;

  // validate the username from the database
  try {
    const response = await userModel.findOne({ username: username });
    // if username is found
    // get the user id from db
    const userId = response._id;
    console.log(userId);

    // check the password for that user
    const dbPassword = response.password;
    //return true if password is matched
    // becuase password from db is in encrypted form
    if (bcrypt.compareSync(password, dbPassword)) {
      // generate the json web token for authetication

      const token = jwt.sign({ userId: userId }, "secret-key");

      // save this token to the local storage
      localStorage.setItem("userToken", token);
      // save the username to display the current login user
      localStorage.setItem("currentUser", `${username}`);
      // after login redirect the dashboard page
      res.redirect("/dashboard");
    } else {
      res.render("index", {
        title: "Welcome To The Password Manager",
        msg: "Wrong Password",
      });
    }
  } catch (error) {
    res.render("index", {
      title: "Welcome To The Password Manager",
      msg: "Invalid Username",
    });
  }
});

// get the sign up page

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Welcome To The Password Manager", msg: "" });
});

// hanlde the post request on the sign up page

router.post("/signup", validateUsername, validateEmail, (req, res) => {
  // get the users detial from signup form
  const username = req.body.uname;
  const email = req.body.email;
  let password = req.body.password;
  const confirmPassword = req.body.confpassword;
  // check the confirm password equal to the password or not

  if (password != confirmPassword) {
    res.render("signup", {
      title: "Welcome To The Password Manager",
      msg: "Password Not Matched",
    });
  } else {
    // encrypt the password before storing in database
    password = bcrypt.hashSync(req.body.password, 10);
    //create a new user on provided details

    const newUser = new userModel({
      username: username,
      email: email,
      password: password,
    });

    try {
      newUser.save();
      res.render("signup", {
        title: "Welcome To The Password Manager",
        msg: "User Registered Successfully",
      });
    } catch (error) {
      throw err;
    }
  }
});

// get the password category page

router.get("/passwordCategory", validateLogin, async (req, res) => {
  try {
    // Retrieve flash messages
    const message = req.flash('msg');
    let currUser = localStorage.getItem("currentUser");
    const data = await passCatModel.find({}).exec();
    res.render("password_category", {
      title: "Password Category List",
      data: data,
      currUser: currUser,
      msg: message,
    });
  } catch (error) {
    throw error;
  }
});

// handle the delete password category route

router.get("/passwordCategory/delete/:id", async (req, res) => {
  let currUser = localStorage.getItem("currentUser");
  // get the object id of the category to be deleted
  const objectId = req.params.id;
  // delete with object from dataabase
  try {
    await passCatModel.findByIdAndDelete(objectId).exec();
    const data = await passCatModel.find({}).exec();
    // Store success message in flash
    req.flash('msg', 'Password Category Deleted Successfully');
    res.redirect('/passwordCategory')
  } catch (error) {
    throw error;
  }
});


//handle the edit password category route 

router.get("/passwordCategory/edit/:id",async (req,res)=>{
  try {
    // get the object id 
    const objectId = req.params.id
    const object = await passCatModel.findById(objectId).exec()
   
    
    res.render('edit_password_category',{objId:objectId,object:object,title:"Edit Password Category"})
  } catch (error) {
    throw error
  }
})

//handle the new upadated password category
router.post('/passwordCategory/edit/:id',async (req,res)=>{
  try {
    const objectId = req.params.id
    console.log(objectId)
    await passCatModel.findByIdAndUpdate(objectId,{
      password_category:req.body.editcatg,
    },{new:true}).exec()
    req.flash('msg', 'Password Category Updated Successfully');
    res.redirect('/passwordCategory')
  } catch (error) {
      throw error
  }
 
})

// get the add new category page

router.get("/add-new-category", validateLogin, (req, res) => {
  let currUser = localStorage.getItem("currentUser");
  res.render("add-new-category", {
    title: "Add new category",
    currUser: currUser,
    error: null,
    msg: "",
  });
});

// handle the post request on add new category
router.post(
  "/add-new-category",
  validateLogin,
  validatePasswordCategory,
  [
    // Validate and sanitize the newcatg field
    body("newcatg")
      .isLength({ min: 1 })
      .withMessage("Enter a password category")
      .trim()
      .escape(),
  ],
  async (req, res) => {
    let currUser = localStorage.getItem("currentUser");
    // Handle the validation results
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // add the password category to the database
      try {
        await new passCatModel({
          password_category: req.body.newcatg,
        }).save();
        res.render("add-new-category", {
          title: "Add new category",
          currUser: currUser,
          error: null,
          msg: "Password Category Added Successfully",
        });
      } catch (error) {
        throw error;
      }
    } else {
      // if the user does not enter the data
      res.render("add-new-category", {
        title: "Add new category",
        currUser: currUser,
        error: errors,
        msg: "",
      });
    }
  }
);

// get the add new password page

router.get("/add-new-password", validateLogin, (req, res) => {
  res.render("add-new-password", { title: "Add New Password" });
});

// get the view all passwords page

router.get("/view-all-password", validateLogin, (req, res) => {
  res.render("view-all-password", { title: "Password Details List" });
});

//get the dashboard page

router.get("/dashboard", validateLogin, (req, res) => {
  let currUser = localStorage.getItem("currentUser");
  res.render("dashboard", {
    currentUser: currUser,
    title: "Dashboard",
  });
});

// handle the logout page

router.get("/logout", (req, res) => {
  // remove the assigned token form local storage
  localStorage.removeItem("userToken");
  //remove the current user from local storage
  localStorage.removeItem("currentUser");
  // redirect the login page
  res.redirect("/");
});
module.exports = router;
