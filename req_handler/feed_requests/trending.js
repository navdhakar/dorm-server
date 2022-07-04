const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');

const proctor_trending_uri = "http://127.0.0.1:8000/trending_page"
router.use(cors({
    origin: '*'
}));

router.get('/trending_feed', (req, res) =>{
   
    fetch(proctor_trending_uri)
    .then((response => response.json()))
    .then((data) => {
        console.log(data);
        res.send(data);
    })
}); 
module.exports = router;