const router = require("express").Router();

// @route		GET api/profile
// @desc		Test profile route
// @access	Public
router.get("/", (req, res) => {
  res.json({ msg: "Profile works" });
});

module.exports = router;
