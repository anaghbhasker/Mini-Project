var express = require("express");
var router = express.Router();

const userhelper = require("../helpers/userhelp");

// login page
let loginErr = null;
router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    userhelper.getHome().then((product) => {
      res.render("home", { product });
    });
  } else {
    res.render("index", { loginErr });
    loginErr = null;
  }
});

// login page

// After login

router.post("/login", (req, res) => {
  userhelper.dologin(req.body).then((response) => {
    if (response.Status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else {
      loginErr = "Invalid email or password";
      res.redirect("/");
    }
  });
});

// After login

// Get signup page

let signupErr = null;
router.get("/signuppage", (req, res) => {
  res.render("signup", { signupErr });
  signupErr = null;
});

// Get signup page

// After signup

router.post("/register", (req, res) => {
  userhelper.doSinup(req.body).then((response) => {
    if (response.userExist) {
      signupErr = "Email already difined !";
      res.redirect("/signuppage");
    } else {
      req.session.user = response.user;
      req.session.loggedIn = true;
      res.redirect("/");
    }
  });
});

// After signup

// Logout press

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Logout press

module.exports = router;
