const express = require("express");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

//database
const db = require("./database");

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log(err));

//config
const config = require("./config/keys");

app.get("/", (req, res) => res.send("INDEX"));

//Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || config.PORT;

app.listen(port, () => console.log(`Server running on port ${port}`));
