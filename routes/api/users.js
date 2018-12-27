const router = require("express").Router();

// @route		GET api/users
// @desc		Test users route
// @access	Public
router.get("/", (req, res) => {
  res.json({ msg: "Usets works" });
});

module.exports = router;
