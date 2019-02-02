const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../config/keys");
const passport = require("passport");
const db = require("../../database");

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route		POST api/users/register
// @desc		Register user
// @access	Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ where: { email: req.body.email } }).then(user => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          User.create({
            username: req.body.name,
            email: req.body.email,
            password: hash
          })
            .then(user => {
              // User matched. Create JWT payload
              const payload = { id: user.id, name: user.name };

              // Sign token
              jwt.sign(
                payload,
                config.secretOrKey,
                { expiresIn: 3600 * 24 * 30 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: `Bearer ${token}`
                  });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route		POST api/users/login
// @desc		Login user / Returning JWT Token
// @access	Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ where: { email } }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched. Create JWT payload
        const payload = { id: user.id, name: user.name };

        // Sign token
        jwt.sign(
          payload,
          config.secretOrKey,
          { expiresIn: 3600 * 24 * 30 },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.email = "User not found";
        return res.status(400).json(errors);
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
      name: req.user.username,
      email: req.user.email,
      balance: req.user.balance,
      description: req.user.description,
      avatar: req.user.avatar,
      likes: req.user.likes,
      dislikes: req.user.dislikes,
      createdAt: req.user.createdAt
    });
  }
);

// @route		GET api/users/:id
// @desc		Return user by id
// @access	Public
router.get("/:id", (req, res) => {
  db.query(
    `
	SELECT id, username, avatar, description, lastVisite, likes, dislikes, createdAt FROM users
	WHERE id = ?
	`,
    {
      replacements: [req.params.id],
      type: db.QueryTypes.SELECT
    }
  ).then(user => {
    res.json({
      user: user[0]
    });
  });
});

// @route		GET api/users
// @desc		Get users route
// @access	Public
router.get("/", (req, res) => {
  db.query("SELECT COUNT(`users`.`id`) AS `total` FROM `users`", {
    type: db.QueryTypes.SELECT
  }).then(users_count => {
    const current = req.query.p ? parseInt(req.query.p) : 1,
      per_page = 15,
      offset = current <= 1 ? 0 : current * per_page - per_page,
      next_page = current + 1,
      count_of_pages = Math.ceil(users_count[0].total / per_page),
      no_more = count_of_pages <= current ? true : false;

    db.query(
      `
			SELECT id, username, description, avatar, likes, dislikes, createdAt
			FROM users 
			ORDER BY likes DESC LIMIT ?, ?
			`,
      {
        replacements: [offset, per_page],
        type: db.QueryTypes.SELECT
      }
    ).then(users => {
      res.json({
        total: users_count[0].total,
        per_page,
        current_page: current,
        next_page,
        users,
        no_more
      });
    });
  });
});

module.exports = router;
