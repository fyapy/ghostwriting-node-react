const router = require("express").Router();
const db = require("../../database");
const passport = require("passport");
const isEmpty = require("../../validation/is-empty");

// Load Input Validation
const validatePostInput = require("../../validation/post");

// Load Posts model
const Posts = require("../../models/Posts");

// @route		GET api/posts
// @desc		Get posts route
// @access	Public
router.get("/", (req, res) => {
  db.query("SELECT COUNT(`posts`.`id`) AS `total` FROM `posts`", {
    type: db.QueryTypes.SELECT
  }).then(posts_count => {
    const current = req.query.p ? parseInt(req.query.p) : 1,
      per_page = 10,
      offset = current <= 1 ? 0 : current * per_page - per_page,
      next_page = current + 1,
      count_of_pages = Math.ceil(posts_count[0].total / per_page),
      no_more = count_of_pages <= current ? true : false;

    db.query(
      "SELECT `posts`.*, `user`.`id` AS `userId`, `user`.`username` AS `userUsername`, `user`.`avatar` AS `userAvatar` FROM `posts` INNER JOIN `users` AS `user` ON `posts`.`userId` = `user`.`id` ORDER BY createdAt DESC LIMIT ?, ?",
      {
        replacements: [offset, per_page],
        type: db.QueryTypes.SELECT
      }
    ).then(posts => {
      // Get Posts ids array
      let postsIds = [];
      for (let index = 0; index < posts.length; index++) {
        postsIds.push(posts[index].id);
      }
      // Get messages count of posts
      db.query(
        "SELECT `postId`, COUNT(`messages`.`postId`) AS `count` FROM `messages` WHERE `postId` IN (?) GROUP BY `messages`.`postId`",
        {
          replacements: [postsIds],
          type: db.QueryTypes.SELECT
        }
      ).then(messages => {
        // Add Messages to Posts
        posts.forEach(post => {
          // Find Message for Post
          let mess = messages.find(x => x.postId === post.id);
          // Adding count of Messages for post
          post.messages = mess ? mess.count : "0";
        });

        res.json({
          total: posts_count[0].total,
          per_page,
          current_page: current,
          next_page,
          posts,
          no_more
        });
      });
    });
  });
});

// @route		GET api/posts/my
// @desc		Get user created posts
// @access	Private
router.get(
  "/my",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      `
	SELECT * FROM posts WHERE userId = ? AND workerId IS NULL ORDER BY createdAt DESC
	`,
      {
        replacements: [req.user.id],
        type: db.QueryTypes.SELECT
      }
    ).then(posts => {
      res.json({ posts });
    });
  }
);

// @route		GET api/posts/executor
// @desc		Get user created posts
// @access	Private
router.post(
  "/executor",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const protected = req.body.amount === 0 ? null : req.body.amount;
    console.log(`exec ${req.body.executor}`);

    db.query(`UPDATE posts SET workerId = ?, protected = ? WHERE id = ?`, {
      replacements: [req.body.executor, protected, req.body.post]
    }).then(post => {
      if (protected !== null) {
        db.query(`UPDATE users SET balance = balance - ? WHERE id = ?`, {
          replacements: [req.body.amount, req.user.id]
        });
      }
      res.json({ success: `success` });
    });
  }
);

// @route		POST api/posts
// @desc		Create post
// @access	Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const budget = isEmpty(req.body.budget) ? null : req.body.budget;

    Posts.create({
      title: req.body.title,
      text: req.body.text,
      budget: budget,
      userId: req.user.id
    }).then(post => {
      res.json({
        post
      });
    });
  }
);

// @route		GET api/posts/:id
// @desc		Get post by id
// @access	Public
router.get("/:id", (req, res) => {
  db.query(
    `UPDATE posts SET posts.views = posts.views + 1 WHERE posts.id = ?`,
    {
      replacements: [req.params.id]
    }
  );
  db.query(
    `SELECT 
		posts.*, 
		u.username AS userName, 
		u.avatar AS userAvatar, 
		u.lastVisite AS userLast, 
		u.likes AS userLikes, 
		u.dislikes AS userDislikes, 
		u.createdAt AS userCreatedAt
		FROM posts INNER JOIN users u ON u.id = posts.userId WHERE posts.id = ?`,
    {
      replacements: [req.params.id],
      type: db.QueryTypes.SELECT
    }
  ).then(postRes => {
    const post = postRes[0];
    res.json({
      post
    });
  });
});

module.exports = router;
