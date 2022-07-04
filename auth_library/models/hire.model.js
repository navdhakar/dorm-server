const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

//simple schema
const HireSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  // email: {
  //   type: String,

  //   minlength: 3,
  //   maxlength: 50,
  // },
  image: {
    type: String,
  },
  // project_title: {
  //   type: String,
  //   //required: true,
  //   minlength: 5,
  //   maxlength: 1000,
  //   // unique: true,
  // },
  blog_description: {
    type: String,

    // unique: true,
  },
  // technology_required: {
  //   type: String,
  //   //required: true,

  //   maxlength: 255,
  // },
  date: {
    type: String,
    //required: true,
    //minlength: 3,
  },
  // budget: {
  //   type: Number,
  //   //required: true,
  //   //minlength: 3,
  //   maxlength: 255,
  // },
  // required_experience: {
  //   type: String,

  //   minlength: 3,
  //   maxlength: 255,
  // },
  // service_required: {
  //   type: String,

  //   //minlength: 3,
  //   maxlength: 255,
  // },
  //milestone needs to be added
  //give different access rights if admin or not
  isAdmin: Boolean,
});

//custom method to generate authToken
HireSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("myprivatekey")); //get the private key from the config file -> environment variable
  return token;
};

const Hire = mongoose.model("Hire", HireSchema);

//function to validate Hire
function validateHire(Hire) {
  const schema = Joi.object({
    title: Joi.string(),
    // email: Joi.string(),
    image: Joi.number(),
    // project_title: Joi.string().max(255),
    blog_description: Joi.string(),
    // technology_required: Joi.string(),
    date: Joi.string(),
    // budget: Joi.number(),
    // required_experience: Joi.string(),
    // service_required: Joi.string(),
  });

  return schema.validate(Hire);
}

exports.Hire = Hire;
exports.validate = validateHire;
