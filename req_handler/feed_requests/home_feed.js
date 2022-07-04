const express = require('express');
const router = express.Router();
const cors = require('cors');
const fetch = require('node-fetch');
current_auth_uri = "http://localhost:8002/auth/api/users/current";

proctor_home_uri = "http://127.0.0.1:8000/home_page";




router.use(cors({
    origin: '*'
}));



async function current_auth_check(url = '', auth_token) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'authorization':auth_token
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    // body data type must match "Content-Type" header
  }); 
  return response.json(); // parses JSON response into native JavaScript objects
  }
  async function getData(url = '', req) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers:{
        'Content-Type': 'application/json',
        'authorization':req.headers['authorization']
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body data type must match "Content-Type" header
    }); 
    return response.json(); // parses JSON response into native JavaScript objects
    }

api_comms_data = {
    req_path:"home_feed",
}


const namespace = "[home_feed]:";


router.get('/home_feed', (req, res) =>{
    console.log(namespace + "request recieved");
    subsection = req.headers['req_path'];
    if(req.headers['authorization']!==undefined||null||""){
      current_auth_check(current_auth_uri, req.headers['authorization'])
      .then(data => {
      console.log(data); // JSON data parsed by `data.json()` call
      });
          // Example POST method implementation:

        getData(proctor_home_uri + `/${subsection}`, req)
        .then(data => {
          res.send(data); // JSON data parsed by `data.json()` call
        });
    }
    else{
        console.log('generating random home page');
        
        getData(proctor_home_uri + `/${subsection}`, req)
        .then(data => {
          
          res.send(data); // JSON data parsed by `data.json()` call
        });
        
        
    }
}); 
module.exports = router;