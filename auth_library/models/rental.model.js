const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

//simple schema
const RentalSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  city: {
    type: String,
    required: true,
  
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  guest_no: {
    type: Number,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
    minlength: 3,
    maxlength: 255,
  },

  //milestone needs to be added
  //give different access rights if admin or not
  isAdmin: Boolean,
});

//custom method to generate authToken
RentalSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("myprivatekey")); //get the private key from the config file -> environment variable
  return token;
};

const Rental = mongoose.model("Rental", RentalSchema);

//function to validate Rental
function validateRental(Rental) {
  const schema = Joi.object({
    state: Joi.string().required(),
    city: Joi.string().required(),
    area: Joi.string().required(),
    address: Joi.string().required(),
    description: Joi.string().min(3).max(1000).required(),
    name: Joi.string().min(3).max(255).required(),
    image: Joi.string().required(),
    price: Joi.number().required(),
    guest_no: Joi.number().required(),
    contact: Joi.number().required(),
  });

  return schema.validate(Rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
