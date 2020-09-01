var express = require("express");
var router = express.Router();
router.get("/", function (req, res) {
    res.render("home");
});
router.get("/login", function (req, res) {
    res.render("login");
});
router.get("/signup", function (req, res) {
    res.render("signup");
});
router.get("/products", function (req, res) {
    res.render("products");
});
router.get("/products/add", function (req, res) {
    res.render("products/add");
});
router.get("/operations", function (req, res) {
    res.render("operations");
});
router.get("/operations/add", function (req, res) {
    res.render("operations/add");
});

router.get("/operations/view", function (req, res) {
    res.render("operations/view");
});

router.get("/events", function (req, res) {
    res.render("events");
});
router.get("/events/add", function (req, res) {
    let variable = '';
    req.vaiables = { "roomType": [] };
    res.render("events/add");
});

router.get("/dictionary", function (req, res) {
    res.render("dictionarys");
});
module.exports = router;