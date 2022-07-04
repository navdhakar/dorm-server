const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const api_handler = require("auth_library");
// const home_feed = require("./req_handler/feed_requests/home_feed");
// const trending_feed = require("./req_handler/feed_requests/trending");
const register = require("./req_handler/add_portfolio_req/register_api");

// const view_requests = require("./req_handler/vote_view_request/view_requests");
const profile_update = require("./response_handler/update_handler");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("profile"));
app.use("/", express.static("images"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*const fs = require("fs");
fs.readFile("links.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      links = JSON.parse(jsonString);
      console.log("Customer address is:", links); // => "Customer address is: Infinity Loop Drive"
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });;*/

ack_msg = {
  user: "on registration server",
};
app.use("/auth", api_handler);
app.use("/post", api_handler);
app.use("/hire_api", api_handler);
app.use("/work_api", api_handler);
app.use("/signup", api_handler);
app.use("/students", api_handler);


app.get("/test", (req, res) => {
  console.log("incoming request")
  res.send("server up and running")
})
// app.use('/home', home_feed)
// app.use('/trending', trending_feed)
// app.use('/views_reqs', view_requests)
app.use("/api", profile_update);
app.post("/", (req, res) => {
  res.send(ack_msg);
  console.log(req.body);
});
//process.env.PORT ||
app.listen(process.env.PORT || 8002);
