const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authenticate } = require("../auth/authenticate");
const db = require("../database/dbConfig");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

function register(req, res) {
  const user = req.body;

  if (user.username && user.password) {
    user.password = bcrypt.hashSync(user.password, 8);

    db("users")
      .insert(user)
      .then(([id]) => {
        res.status(200).json(id);
      })
      .catch(err => {
        console.error("REGISTER ERROR", err);
        res
          .status(500)
          .json({ message: "Something went wrong during registration." });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide a username and password to register." });
  }
}

function login(req, res) {
  const login = req.body;

  if (login.username && login.password) {
    db("users")
      .where({ username: login.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(login.password, user.password)) {
          const token = generateToken(user);

          res.status(200).json({
            message: `Welcome ${user.username}!`,
            token
          });
        } else {
          res.status(401).json({ message: "Invalid credentials." });
        }
      })
      .catch(err => {
        console.error("LOGIN ERROR", err);
        res.status(500).json({ message: "Oops, we had an issue logging in." });
      });
  } else {
    res
      .status(400)
      .json({ message: "Please provide your username and password." });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const secret =
    process.env.JWT_SECRET ||
    "add a .env file to root of project with the JWT_SECRET variable";

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}
