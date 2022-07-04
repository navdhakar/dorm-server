const auth = require("../middleware/auth");
const login_auth = require("../middleware/login_auth");
const email_verification = require("../middleware/email_verification");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user.model");
const { ProjectSelected } = require("../models/opportunity.model");
const config = require("config");

require("dotenv").config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRTET_KEY,
});
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const multer = require("multer");
console.log("users");
let generated_otp;
let recieved_otp;
let new_user_data = {};
router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  // console.log(email);
  const project = await ProjectSelected.find({ email: user.email });
  res.send(user);
});
router.post("/data_update", auth, async (req, res) => {
  // console.log(req.body.name);
  const user = await User.findById(req.user._id).select("-password");

  user.name = req.body.name;
  user.email = req.body.email;
  user.college_name = req.body.college_name;
  user.college_year = req.body.college_year;
  user.college_branch = req.body.college_branch;
  // graduation_institute: req.body.graduation_institute,
  // dob: [{ date: req.body.date, month: req.body.month, year: req.body.year }],
  // contact_no: req.body.contact_no,
  user.github_profile = req.body.github_profile;
  user.instagram_profile = req.body.instagram;
  user.twitter_profile = req.body.twitter;
  user.facebook_profile = req.body.facebook;

  user.skills = req.body.skills;
  user.rating = 1;
  user.save();
  res.send(user);
});

router.post("/login", login_auth, async (req, res) => {
  console.log(req.auth_token);
  res.send({
    token_data: req.auth_token,
  });
});
//profile image
const DIR = "./profile";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// User model

router.post("/profile_upload", auth, upload.single("profileImg"), async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  // const name = user.name;
  // console.log("picture");
  // console.log(req.file.filepath);
  // const file = req.file;
  const result = await cloudinary.uploader.upload(req.file.path);
  // console.log(result);
  // const url = req.protocol + "://" + req.get("host");
  user.profileImg = result.secure_url;
  user.cloudinaryID = result.public_id;
  user.save();
  res.send(result);
});

// router.get("/", (req, res, next) => {
//   User.find().then((data) => {
//     res.status(200).json({
//       message: "User list retrieved successfully!",
//       users: data,
//     });
//   });
// });

router.post("/verify_email", async (req, res) => {
  recieved_otp = req.body.otp;
  if (recieved_otp == generated_otp) {
    user = new User({
      name: new_user_data.name,
      password: new_user_data.password,
      email: new_user_data.email,
      college_name: new_user_data.college_name,
      college_year: new_user_data.college_year,
      college_branch: new_user_data.college_branch,
      // graduation_institute: req.body.graduation_institute,
      // dob: [{ date: req.body.date, month: req.body.month, year: req.body.year }],
      // contact_no: req.body.contact_no,
      github_profile: new_user_data.github_profile,
    });
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    console.log(new_user_data.name);
    const token = user.generateAuthToken();
    console.log(token);
    res.header("x-auth-token", token).send({
      _id: user._id,
      name: new_user_data.name,
      password: new_user_data.password,
      email: new_user_data.email,
      college_name: new_user_data.college_name,
      college_year: new_user_data.college_year,
      college_branch: new_user_data.college_branch,
      // graduation_institute: req.body.graduation_institute,
      // dob: [{ date: req.body.date, month: req.body.month, year: req.body.year }],
      // contact_no: req.body.contact_no,
      github_profile: new_user_data.github_profile,
      token_data: token,
    });
  } else {
    console.log("otp didn't match");
    res.status(400).send({ response: "OTP didn't match" });
  }
});
router.post("/new_user", async (req, res) => {
  console.log("request recieved");
  // validate the request body first
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ response: "User already registered." });

  new_user_data = {
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    college_name: req.body.college_name,
    college_year: req.body.college_year,
    college_branch: req.body.college_branch,
    // graduation_institute: req.body.graduation_institute,
    // dob: [{ date: req.body.date, month: req.body.month, year: req.body.year }],
    // contact_no: req.body.contact_no,
    github_profile: req.body.github_profile,
  };

  email_verification(req.body.email).then((value) => {
    console.log("generated " + value);
    generated_otp = value;
  });
  res.send({
    response: "verify email",
  });
});

module.exports = router;
