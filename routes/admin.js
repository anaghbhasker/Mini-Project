var express = require("express");
var router = express.Router();

const adminhelper = require("../helpers/adminhelp");



/* GET users listing. */

router.get("/", function (req, res, next) {
  if (req.session.loggedIn) {
    res.render("adminviews/FirstPage");
  } else {
    res.render("adminviews/loginpage", { loginErr: req.session.loginErr });
    req.session.loginErr = false;
  }
});

// After login

router.post("/adminlogin", (req, res) => {
  adminhelper.dologin(req.body).then((response) => {
    if (response.Status) {
      req.session.loggedIn = true;
      req.session.admin = response.admin;
      res.redirect("/admin");
    } else {
      req.session.loginErr = true;
      res.redirect("/admin");
    }
  });
});

// After login

// Get signup page

let signupErr = null;
router.get("/adminsignuppage", (req, res) => {
  res.render("adminviews/sign.hbs", { signupErr });
  signupErr = null;
});

// Get signup page

// After signup

router.post("/submit", (req, res) => {
  adminhelper.doSinup(req.body).then((response) => {
    if (response.adminExist) {
      signupErr = "Email already difined !";
      res.redirect("/admin/adminsignuppage");
    } else {
      req.session.admin = response.adminData;
      req.session.loggedIn = true;
      res.redirect("/admin");
    }
  });
});

// After signup

// user edit
let searchErr = null;
router.get("/useredit", function (req, res) {
  adminhelper.getUser().then((user) => {
    res.render("adminviews/useredits", { user, searchErr });
    searchErr = null;
  });
});

router.get("/deleteuser/:id", function (req, res) {
  let userId = req.params.id;
  adminhelper.deleteUser(userId);
  res.redirect("/admin/useredit");
});

router.post("/usersearch", async function (req, res, next) {
  const { name } = req.body;
  const found = await adminhelper.searchUser(name);
  const user = [];
  user.push(found);
  if (found) {
    res.render("adminviews/useredits", { user });
  } else {
    searchErr = "Sorry..User Not Found!!!";
    res.redirect("/admin/useredit");
  }
});

// user edit

// product edit


let productsearchErr = null;
router.get("/productedit", function (req, res) {
  adminhelper.getProduct().then((product) => {
    res.render("adminviews/productedits", { product, productsearchErr });
    productsearchErr = null;
  });
});

router.post("/addproduct", function (req, res) {
  adminhelper.addProduct(req.body);
  res.redirect("/admin/productedit");
});

router.get("/deleteproduct/:id", function (req, res) {
  console.log(req.params.id);
  let productId = req.params.id;
  adminhelper.deleteProduct(productId);
  res.redirect("/admin/productedit");
});

router.post("/editproduct/:id", function (req, res) {
  adminhelper.editProduct(req.params.id, req.body);
  res.redirect("/admin/productedit");
});

router.post("/productsearch", async function (req, res, next) {
  const { name } = req.body;
  const found = await adminhelper.searchProduct(name);
  const product = [];
  product.push(found);
  if (found) {
    res.render("adminviews/productedits", { product });
  } else {
    productsearchErr = "Sorry..Product Not Found!!!";
    res.redirect("/admin/productedit");
  }
});

// product edit

// back

router.get("/back", (req, res) => {
  req.session.loggedIn = true;
  res.redirect("/admin");
});

// back

// Logout press

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
});

// Logout press

module.exports = router;
