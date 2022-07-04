const express = require('express');
const router = express.Router();
const auth = require("auth_library/middleware/auth");
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require("express-rate-limit");
const { User, validate } = require("auth_library/models/user.model");
const email_verification = require('../middleware/email_verification');
const proctor_delete_uri = process.env.PROCTOR_DELETE_URI;
router.use(cors({
    origin: '*'
}));

var generated_otp;
var updated_email;
router.post('/update_profile', auth, async (req,res) => {
console.log("recieved a update request");
const user = await User.findById(req.user._id).select("-password");
console.log(req.body.update_type);
if(req.body.update_type=='username'){
  console.log(req.body.update_input)
  user.name = req.body.update_input;
  await user.save();
  res.send(user);
}
else if(req.body.update_type=='email'){
  console.log(req.body.update_input)
  email_verification(req.body.update_input)
  .then((data) =>{
    console.log(data);
    generated_otp = data;
    updated_email = req.body.update_input;
    res.send({response:'verify email'});
  })
}
else if(req.body.update_type=='portfolio_url'){
  user.portfolio_url = req.body.update_input;
  await user.save();
  res.send(user);
}
});
router.post('/update_email', auth, async (req, res) => {
  console.log('updating email');
  const user = await User.findById(req.user._id).select("-password");
   if(generated_otp==req.body.email_otp){
      user.email = updated_email;
      await user.save();
   }
   console.log('updated email');
   res.send(user)
});


//delete request handler
router.get('/delete_portfolio', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  user_email = {
    email:user.email
  }
  try{
  fetch(proctor_delete_uri, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    body:JSON.stringify(user_email),
    // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body data type must match "Content-Type" header
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('portfolio deleted');
    console.log(data);
  })
}
catch(error){
  console.log('something went wrong');
}
})

module.exports = router;