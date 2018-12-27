const router = require("express").Router();

// @route		GET api/posts
// @desc		Test posts route
// @access	Public
router.get("/", (req, res) => {
  res.json({ msg: "Posts works" });
});

module.exports = router;
