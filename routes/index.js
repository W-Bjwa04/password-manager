var express = require("express");
var router = express.Router();
const userModel = require("../modules/user");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); // for password encryption
const jwt = require("jsonwebtoken");

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

router.get("/passwordCategory",validateLogin, (req, res) => {
  res.render("password_category", { title: "Password Category List" });
});

// get the add new category page

router.get("/add-new-category", validateLogin,(req, res) => {
  res.render("add-new-category", { title: "Add new category" });
});

// get the add new password page

router.get("/add-new-password",validateLogin, (req, res) => {
  res.render("add-new-password", { title: "Add New Password" });
});

// get the view all passwords page

router.get("/view-all-password", validateLogin,(req, res) => {
  res.render("view-all-password", { title: "Password Details List" });
});

//get the dashboard page

router.get("/dashboard",validateLogin, (req, res) => {
  let currUser = localStorage.getItem("currentUser");

  if (!currUser) {
    currUser = "Guest";
  }
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
