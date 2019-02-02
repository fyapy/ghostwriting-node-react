const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const db = require("../database");

module.exports = socket => {
  let currentUser = null;

  // socket.emit("news", { hello: "world" });
  console.log(`User connected ${currentUser}`);

  socket.on("setUser", data => {
    const token = data.token.split(" ")[1];
    jwt.verify(token, config.secretOrKey, function(err, decoded) {
      currentUser = decoded.id;
      console.log(`User authenticated ${currentUser}`);
      db.query(`UPDATE users SET socket = ? WHERE id = ?`, {
        replacements: [socket.id, currentUser]
      });
    });
  });

  socket.on(`sendMessage`, data => {
    db.query(`SELECT id, socket FROM users WHERE id = ?`, {
      replacements: [data.to],
      type: db.QueryTypes.SELECT
    }).then(recipient => {
      // Create new message
      db.query(
        `INSERT INTO messages (text, fromId, toId, postId) VALUES (?, ?, ?, ?)`,
        {
          replacements: [data.text, currentUser, recipient[0].id, data.post]
        }
      );
      // Emmiting to user
      socket.broadcast.to(recipient[0].socket).emit("receivingMessage", {
        text: data.text,
        from: currentUser,
        to: recipient[0].id
      });
    });
  });

  socket.on(`messageRead`, data => {
    db.query(
      `
    UPDATE messages SET readed = true WHERE
    (fromId = ? AND toId = ?)
    `,
      {
        replacements: [data.to, currentUser]
      }
    );

    db.query(`SELECT id, socket FROM users WHERE id = ?`, {
      replacements: [data.to],
      type: db.QueryTypes.SELECT
    }).then(recipient => {
      // Emmiting to user
      socket.broadcast.to(recipient[0].socket).emit("messagesReaded", {
        from: currentUser
      });
    });
  });

  socket.on("getUnreaded", data => {
    db.query(`SELECT id, socket FROM users WHERE id = ?`, {
      replacements: [data.user],
      type: db.QueryTypes.SELECT
    }).then(user => {
      // Emmiting to user
      db.query(
        `SELECT COUNT(id) AS unreaded FROM messages WHERE toId = ? AND readed IS NULL`,
        {
          replacements: [data.user],
          type: db.QueryTypes.SELECT
        }
      ).then(unreaded => {
        socket.emit("setUnreaded", {
          user: data.user,
          unreaded: unreaded[0].unreaded
        });
      });
    });
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
};
