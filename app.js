const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

try {
  mongoose.connect("mongodb://localhost:27017/userDB");
  console.log("DB connected");
} catch (error) {
  console.log(error);
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

const secretSchema = mongoose.Schema({
  secret: String,
});

const Secret = mongoose.model("Secret", secretSchema);

app.get("/", (_req, res) => {
  res.render("home");
});

app.get("/logout", (_req, res) => {
  res.redirect("/");
});

app
  .route("/register")
  .get((_req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const data = req.body;
    const newUser = new User({
      email: data.username,
      password: data.password,
    });
    newUser.save(function (err, _user) {
      err ? console.log(err) : res.render("secrets");
    });
  });

app
  .route("/login")
  .get((_req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const data = req.body;
    User.findOne({ email: data.username }, function (err, user) {
      if (err || !user) {
        console.log(err);
        res.send("User Not Found! \nIncorrect Email!");
      } else {
        if (user.password === data.password) {
          res.render("secrets");
        } else {
          res.send("Wrong Password!");
        }
      }
    });
  });

app
  .route("/submit")
  .get((_req, res) => {
    res.render("submit");
  })
  .post((req, res) => {
    const newSecret = new Secret({
      secret: req.body.secret,
    });
    newSecret.save(function (err, result) {
      if (err) {
        console.log(err);
        res.send("Error\n" + error);
      } else {
        res.render("secrets");
      }
    });
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server runing!");
});
