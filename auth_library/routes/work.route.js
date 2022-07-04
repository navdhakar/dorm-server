const auth = require("../middleware/auth");
const login_auth = require("../middleware/login_auth");
const bcrypt = require("bcrypt");
const { Hire, validate } = require("../models/hire.model");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/work", async (req, res) => {
  console.log("workRoute:request recieved");
  const work = await Hire.find().limit(10);
  res.send(work);
});

router.post("/login", login_auth, async (req, res) => {
  console.log(req.auth_token);
  res.send({
    token_data: req.auth_token,
  });
});

// router.post("/hire_us", async (req, res) => {
//   //validate the request body first
//   // const { error } = validate(req.body);
//   // if (error) return res.status(400).send(error.details[0].message);

//   // //find an existing Hire
//   // let hire = await Hire.findOne({ email: req.body.email });
//   // if (hire) return res.status(400).send("Hire already registered.");
//   console.log("request recieved");
//   hire = new Hire({
//     company_name: req.body.company_name,
//     email: req.body.email,
//     contact_no: req.body.contact_no,
//     project_title: req.body.project_title,
//     project_description: req.body.project_description,
//     technology_required: req.body.technology_required,
//     time_limit: req.body.time_limit,
//     budget: req.body.budget,
//     required_experience: req.body.required_experience,
//   });
//   // hire.password = await bcrypt.hash(hire.password, 10);
//   await hire.save();
//   console.log(req.body.company_name);
//   const token = hire.generateAuthToken();
//   res.header("x-auth-token", token).send({
//     _id: hire._id,
//     company_name: req.body.company_name,
//     email: req.body.email,
//     contact_no: req.body.contact_no,
//     project_title: req.body.project_title,
//     project_description: req.body.project_description,
//     technology_required: req.body.technology_required,
//     time_limit: req.body.time_limit,
//     budget: req.body.budget,
//     required_experience: req.body.required_experience,
//     token_data: token,
//   });
// });

module.exports = router;
