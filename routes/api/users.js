const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/keys");
const passport = require("passport");

// Load User model
const User = require("../../models/User");

// @route		GET api/users
// @desc		Test users route
// @access	Public
router.get("/", (req, res) => {
  res.json({ msg: "Usets works" });
});

// @route		GET api/users/register
// @desc		Register user
// @access	Public
router.post("/register", (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exist" });
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
          })
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route		GET api/users/login
// @desc		Login user / Returning JWT Token
// @access	Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ where: { email } }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched. Create JWT payload
        const payload = { id: user.id, name: user.name };

        // Sign token
        jwt.sign(
          payload,
          config.secretOeKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res.status(400).json({ error: "User not found" });
      }
    });
  });
});

// @route		GET api/users/current
// @desc		Return current user
// @access	Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
