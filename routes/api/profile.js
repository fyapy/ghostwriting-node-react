const router = require("express").Router();
const db = require("../../database");
const passport = require("passport");
const base64Img = require("base64-img");
const crypto = require("crypto");
const isEmpty = require("../../validation/is-empty");

// Validation
const validateAvatarInput = require("../../validation/avatar");
const validateDescriptionInput = require("../../validation/description");

// @route		GET api/profile/dialogs
// @desc		Get user dialogs preview
// @access	Private
router.get(
  "/dialogs",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      `SELECT
				DISTINCT m.toId, m.fromId 
				FROM messages m WHERE m.fromId = ? 
		 	UNION
			SELECT
				DISTINCT m.toId, m.fromId 
				FROM messages m WHERE m.toId = ? 
		`,
      {
        replacements: [req.user.id, req.user.id],
        type: db.QueryTypes.SELECT
      }
    ).then(dialog => {
      let users = [];
      let id = req.user.id;

      // Get users with whom user have dialog
      dialog.forEach(dia => {
        // If user id not equal fromId
        if (dia.fromId != id && users.indexOf(dia.fromId) == -1) {
          users.push(dia.fromId);
          // If user id not equal toId
        } else if (dia.toId != id && users.indexOf(dia.toId) == -1) {
          users.push(dia.toId);
        }
      });

      // Add current user to array
      users.push(id);

      db.query(`SELECT * FROM users WHERE id IN (?)`, {
        replacements: [users],
        type: db.QueryTypes.SELECT
      }).then(interlocutor => {
        db.query(
          `SELECT * FROM messages
          WHERE
          (fromId = ? AND toId IN (?))
          OR
          (toId = ? AND fromId IN (?))
          `,
          {
            replacements: [id, users, id, users],
            type: db.QueryTypes.SELECT
          }
        ).then(messages => {
          res.json({ messages, users: interlocutor });
        });
      });
    });
  }
);

// @route		GET api/profile/dialog/:id
// @desc		Get user dialog with someone
// @access	Private
router.get(
  "/dialog/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const id = req.user.id;
    const target = req.params.id;
    db.query(
      `
		SELECT * FROM messages WHERE 
		(toId = ? AND fromId = ?)
		OR
		(fromId = ? AND toId = ?)
		`,
      {
        replacements: [id, target, id, target],
        type: db.QueryTypes.SELECT
      }
    ).then(messages => {
      res.json({
        messages,
        user: req.params.id
      });
    });
  }
);

// @route		POST api/profile/avatar
// @desc		Update user avatar
// @access	Private
router.post(
  "/avatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAvatarInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    let time = Math.floor(Date.now() / 1000);
    let fileName = req.user.id + "_" + time;
    let avatarName = req.user.id + "_" + time + ".png";

    base64Img.img(req.body.upload, "./app/img", fileName, (err, filepath) => {
      db.query(
        `
			UPDATE users SET avatar = ? WHERE id = ?
			`,
        {
          replacements: [avatarName, req.user.id]
        }
      ).then(user => {
        res.json({ avatar: avatarName });
      });
    });
  }
);

// @route		POST api/profile/description
// @desc		Edit user description
// @access	Private
router.post(
  "/description",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateDescriptionInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    db.query(`UPDATE users SET description = ? WHERE id = ?`, {
      replacements: [req.body.description, req.user.id]
    }).then(user => {
      res.json({ description: req.body.description });
    });
  }
);

// @route		GET api/profile/balance
// @desc		Edit user description
// @access	Private
router.get(
  "/balance",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.query(
      `SELECT * FROM payments WHERE user_id = ? ORDER BY createdAt DESC`,
      {
        replacements: [req.user.id]
      }
    ).then(balance => {
      res.json({ balance: balance[0] });
    });
  }
);

router.post(
  "/cashout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const yandex_money = isEmpty(req.body.yandex_money)
      ? null
      : req.body.yandex_money;
    const card = isEmpty(req.body.card) ? null : req.body.card;
    const amount = req.body.amount;

    db.query(
      `INSERT INTO payouts (amount, userId, yandex_money, card) VALUES (?, ?, ?, ?)`,
      {
        replacements: [amount, req.user.id, yandex_money, card]
      }
    );

    db.query(`UPDATE users SET balance = balance - ? WHERE id = ?`, {
      replacements: [amount, req.user.id]
    }).then(balance => {
      db.query(
        `INSERT INTO payments (user_id, amount, payload) VALUES (?, ?, ?)`,
        {
          replacements: [req.user.id, amount, 0]
        }
      ).then(payment => {
        db.query(`SELECT balance FROM users WHERE id = ?`, {
          replacements: [req.user.id],
          type: db.QueryTypes.SELECT
        }).then(new_balance => {
          res.json({ success: "success", balance: new_balance[0].balance });
        });
      });
    });
  }
);

//Vj3cYXtZeo04NgUGJ+UwR8gX
// @route		POST api/profile/replenishment
// @desc		User Balance replenishment
// @access	Private
router.post("/replenishment", (req, res) => {
  let hash = crypto
    .createHash("sha1")
    .update(
      `${req.body.notification_type}&${req.body.operation_id}&${
        req.body.amount
      }&${req.body.currency}&${req.body.datetime}&${req.body.sender}&${
        req.body.codepro
      }&Vj3cYXtZeo04NgUGJ+UwR8gX&${req.body.label}`
    )
    .digest("hex");

  if (
    hash == req.body.sha1_hash &&
    req.body.codepro == "false" &&
    req.body.unaccepted == "false"
  ) {
    let userId = req.body.label ? req.body.label : 1;
    db.query(`INSERT INTO payments (user_id, amount) VALUES(?, ?)`, {
      replacements: [userId, req.body.amount]
    });
    db.query(`UPDATE users SET balance = balance + ? WHERE id = ?`, {
      replacements: [req.body.amount, userId]
    });
    res.status(200).json({ success: "success" });
  } else {
    db.query(`INSERT INTO payments (user_id, amount) VALUES(?, ?)`, {
      replacements: [0, 0]
    });
  }
});

module.exports = router;
