const express = require('express');
const router = express.Router();
const cors = require('cors');
const fetch = require('node-fetch');
const rateLimit = require("express-rate-limit");
current_auth_uri = "http://localhost:8002/auth/api/users/current";

proctor_view_uri = "http://127.0.0.1:8000/view_counter";



const limiter = rateLimit({
    windowMs: 30*1000, // 15 minutes
    max: 1 // limit each IP to 100 requests per windowMs
  });

router.use(cors({
    origin: '*'
}));


router.post('/view_counter', limiter, (req, res) => {
    console.log(req.body.portfolio_url);
    portfolio_data = {
        portfolio_url:req.body.portfolio_url,
        group:req.body.group
    }
    fetch(proctor_view_uri, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    // no-cors, *cors, same-originfol
    body:JSON.stringify(portfolio_data),
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        res.send(data);
    })
});

module.exports = router;