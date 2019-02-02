const express = require("express");
const app = express();
// const server = require("http").Server(app);
const server = app.listen(5000, () =>
  console.log(`Server running on port 5000`)
);
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const io = require("socket.io").listen(server);

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const deals = require("./routes/api/deals");

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

//Database
const db = require("./database");

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch(err => console.log(err));

//config
const config = require("./config/keys");

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Static files
app.use(
  express.static(__dirname + "/app", {
    etag: config.etag,
    maxage: config.maxage
  })
);
app.use(
  express.static(__dirname + "/client/build", {
    etag: config.etag,
    maxage: config.maxage
  })
);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);
app.use("/api/deals", deals);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// Setting up Socket IO
io.on("connection", require("./socket/index"));

const port = process.env.PORT || config.PORT;

// server.listen(port, () => console.log(`Server running on port ${port}`));
