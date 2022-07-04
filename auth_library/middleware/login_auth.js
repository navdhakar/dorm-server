const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validate } = require("../models/user.model");
const bcrypt = require("bcrypt");
module.exports = async function (req, res, next) {
  //get the token from the header if present
  const password = req.body.password;

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ response: "email dosen't exist" });

  req_password_hash = await bcrypt.hash(password, 10);
  console.log(req_password_hash);
  console.log(user.password);
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) {
      throw err;
    } else if (!isMatch) {
      console.log("Password doesn't match!");
      res.status(400).send({ response: "password didn't match" });
    } else {
      console.log("Password matches!");
      const token = user.generateAuthToken();
      req.auth_token = token;

      next();
    }
  });

  //if no token found, return response (without going to the next middelware)
};
