const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

//simple schema
const OpportunutySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  college_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  college_year: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  college_branch: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },

  // graduation_institute: {
  //   type: String,
  //   required: true,
  //   minlength: 3,
  //   maxlength: 255,
  // },
  // dob: [{ date: Number, month: Number, year: Number }],
  // contact_no: {
  //   type: String,
  //   required: true,
  //   minlength: 3,
  //   maxlength: 255,
  // },
  selected_project: { type: Array, default: [] },
  //give different access rights if admin or not
  isAdmin: Boolean,
});

//custom method to generate authToken
OpportunutySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("myprivatekey")); //get the private key from the config file -> environment variable
  return token;
};

const ProjectSelected = mongoose.model("ProjectSelected", OpportunutySchema);

//function to validate user
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),

    college_year: Joi.string().max(255).required(),
    college_branch: Joi.string().max(255).required(),
    college_name: Joi.string().max(255).required(),
    // graduation_institute: Joi.string().min(3).max(255).required(),
    // dob: Joi.string().min(3).max(255).required(),
    // contact_no: Joi.string().min(3).max(255).required(),
    // selected_project: Joi.string().min(3).max(255).required(),

    // group: Joi.string().min(3).max(255).required(),
  });

  return schema.validate(user);
}

exports.ProjectSelected = ProjectSelected;
exports.validate = validateUser;
