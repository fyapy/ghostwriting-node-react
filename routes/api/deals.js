const router = require("express").Router();
const db = require("../../database");
const passport = require("passport");

// @route		GET api/deals
// @desc		Get geals route
// @access	Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      `
		SELECT 
		posts.id,
		posts.text,
		posts.title,
		posts.userId,
		posts.workerId,
		posts.completed,
		posts.protected,
		posts.createdAt,
		u1.id AS user_id,
		u1.username AS user_name,
		u1.avatar AS user_avatar,
		u2.id AS worker_id,
		u2.username AS worker_name,
		u2.avatar AS worker_avatar
		FROM posts 
		INNER JOIN users u1 ON posts.userId = u1.id 
		LEFT JOIN users u2 ON posts.workerId = u2.id 
		WHERE 
		(workerId = :id AND completed IS NULL) OR 
		(userId = :id AND completed IS NULL AND workerId IS NOT NULL) OR 
		(userId = :id AND completed IS NOT NULL AND workerId IS NOT NULL) OR 
		(userId = :id AND completed IS NULL AND workerId IS NULL) OR 
		(workerId = :id AND completed IS NOT NULL) 
		ORDER BY createdAt DESC
		`,
      {
        replacements: { id: req.user.id },
        type: db.QueryTypes.SELECT
      }
    ).then(deals => {
      res.json({
        deals
      });
    });
  }
);

// @route		POST api/deals/success
// @desc		Get geals route
// @access	Private
router.post(
  "/success",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body.post);

    db.query(
      `
		SELECT * FROM posts WHERE id = ?
		`,
      {
        replacements: [req.body.post],
        type: db.QueryTypes.SELECT
      }
    ).then(postDB => {
      const post = postDB[0];

      if (req.user.id == post.userId) {
        // Update post completed status
        db.query(`UPDATE posts SET completed = 1 WHERE id = ?`, {
          replacements: [post.id]
        });

        // Create Rating
        db.query(
          `INSERT INTO ratings (postId, raiting, userId) VALUES (?, ?, ?)`,
          {
            replacements: [post.id, req.body.status, post.workerId]
          }
        );

        // Update worker balance
        if (post.protected !== null) {
          db.query(`UPDATE users SET balance = balance + ? WHERE id = ?`, {
            replacements: [post.protected, post.workerId]
          });
        }

        // Update worker id likes/dislikes
        db.query(
          `SELECT id, username, likes, dislikes FROM users WHERE id = ?`,
          {
            replacements: [post.workerId],
            type: db.QueryTypes.SELECT
          }
        ).then(user => {
          if (req.body.status == 1) {
            db.query(`UPDATE users SET likes = likes + 1 WHERE id = ?`, {
              replacements: [post.workerId]
            });
          } else {
            db.query(`UPDATE users SET dislikes = dislikes + 1 WHERE id = ?`, {
              replacements: [post.workerId]
            });
          }
        });

        res.json({ success: "success" });
      } else {
        res.status(404).json({ error: `You are not post creator` });
      }
    });
  }
);

module.exports = router;
