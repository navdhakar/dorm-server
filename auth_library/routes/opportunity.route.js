const auth = require("../middleware/auth");
const login_auth = require("../middleware/login_auth");
const bcrypt = require("bcrypt");
const { ProjectSelected, validate } = require("../models/opportunity.model");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const multer = require("multer");
console.log("users");
let new_user_data = {};
router.get("/current", auth, async (req, res) => {
  const user = await ProjectSelected.findById(req.user._id).select("-password");
  res.send(user);
});
router.post("/selected_project", async (req, res) => {
  console.log("request recieved");
  let selected_projects = {
    title: req.body.selected_project.title,
    disc: req.body.selected_project.discription,
    duration: req.body.selected_project.duration,
    type: req.body.selected_project.type,
  };
  // validate the request body first
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // console.log(selected_projects);
  //find an existing user
  let user = await ProjectSelected.findOne({ email: req.body.email });
  if (user) {
    console.log("already have projects");
    console.log(selected_projects);
    user.selected_project.push(selected_projects);

    // await ProjectSelected.updateOne({ email: req.body.email }, { $push: { selected_project: selected_projects } });
  } else {
    user = new ProjectSelected({
      name: req.body.name,
      email: req.body.email,
      college_name: req.body.college_name,
      college_year: req.body.college_year,
      college_branch: req.body.college_branch,
    });
    user.selected_project.push(selected_projects);
  }
  //   user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  console.log(req.body.selected_project);
  //   const token = user.generateAuthToken();
  //   console.log(token);
  res.status(200).send({ response: "successfull" });
});

module.exports = router;
