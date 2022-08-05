const auth = require("../middleware/auth");
const login_auth = require("../middleware/login_auth");
const bcrypt = require("bcrypt");
const { Rental, validate } = require("../models/rental.model");
const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// router.get("/work", auth, async (req, res) => {
//   const rental = await rental.findById(req.rental._id).select("-password");
//   res.send(rental);
// });
// router.post("/login", login_auth, async (req, res) => {
//   console.log(req.auth_token);
//   res.send({
//     token_data: req.auth_token,
//   });
// });
router.get("/rental_all", async (req, res) => {
  const rentals_data = await Rental.find({});
  res.send(rentals_data);
});
router.post("/rental_local", async (req, res) => {
console.log(req.body);
  const rentals_data = await Rental.find({$and:
    [

      {$and: [{state: req.body.state },{ city: req.body.city} ]},
      {area:req.body.area}
    ]});
  res.send(rentals_data);
});

router.post("/rental_area", async (req, res) => {
  const rentals_data = await Rental.find({city:req.body.city}).select('area');
  res.send(rentals_data);
});


router.post("/rental", async (req, res) => {
  //validate the request body first
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  // //find an existing rental
  // let rental = await rental.findOne({ city: req.body.city });
  // if (rental) return res.status(400).send("rental already registered.");
  console.log("rental_route:request recieved");
 
  rental = new Rental({
    state: req.body.state,
    city: req.body.city,
    area: req.body.area,
    address: req.body.address,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    name: req.body.name,
    contact: req.body.contact,
    guest_no:req.body.guest_no
  });
  // rental.password = await bcrypt.hash(rental.password, 10);
  await rental.save();
  console.log(req.body.state);
  const token = rental.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: rental._id,
    state: req.body.state,
    city: req.body.city,
    area: req.body.area,
    address: req.body.address,
    description: req.body.description,
    image: req.body.image,
    price: req.body.price,
    name: req.body.name,
    contact: req.body.contact,
    guest_no:req.body.guest_no,
    token_data: token,
  });
});

module.exports = router;
