const config = require("config");
const mongoose = require("mongoose");
const usersRoute = require("./routes/user.route");
const rentalRoute = require("./routes/rental.route");
// const hireRoute = require("./routes/hire.route");
const workRoute = require("./routes/work.route");
const opportunityRoute = require("./routes/opportunity.route");

const express = require("express");
require("dotenv").config();
const router = express.Router();

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
  console.error("FATAL ERROR: myprivatekey is not defined.");
  process.exit(1);
}
console.log(mongoose.version);
//connect to mongodb
//mongodb://localhost/nodejsauth
database_uri = process.env.MONGO_URI;
//HneIitUJgUTPyius
mongoose
  .connect(database_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => {
    console.error("Could not connect to MongoDB...");
    console.log(err);
  });
console.log("index");

router.use(express.json());
//use users route for api/users
router.use("/rent_stay", rentalRoute);
// router.use("/hire", hireRoute);
router.use("/findwork", workRoute);
router.use("/opportunity", opportunityRoute);

module.exports = router;
