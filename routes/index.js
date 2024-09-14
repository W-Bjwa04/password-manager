var express = require("express");
var router = express.Router();
const userModel = require("../modules/user");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs')  // for password encryption

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
/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Welcome To The Password Manager" });
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
    password = bcrypt.hashSync(req.body.password,10)
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

router.get("/passwordCategory", (req, res) => {
  res.render("password_category", { title: "Password Category List" });
});

// get the add new category page

router.get("/add-new-category", (req, res) => {
  res.render("add-new-category", { title: "Add new category" });
});

// get the add new password page

router.get("/add-new-password", (req, res) => {
  res.render("add-new-password", { title: "Add New Password" });
});

// get the view all passwords page

router.get("/view-all-password", (req, res) => {
  res.render("view-all-password", { title: "Password Details List" });
});
module.exports = router;


