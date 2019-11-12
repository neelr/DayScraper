const express = require("express");
const axios = require("axios");
const next = require("next");
const body = require("body-parser");
const cors = require("cors");
const app = express();
app.use(body.json());
app.use(cors())
const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

const monthNames = ["january", "february", "march", "april", "may", "june","july", "august", "september", "october", "november", "december"];


function fetchData (date,callback) {
  if (date.getMonth() >= 9 && date.getFullYear() == 2019) {
    var str = `<a href="\/day\/${monthNames[date.getMonth()]}-${date.getDate()}\/">`;
  } else {
    var str = `<a href="\/day\/${monthNames[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}\/">`;
  }
  var url = "http://www.holidayscalendar.com/categories/weird/";
  axios.get(url)
    .then((val)=> {
      console.log(str)
      var tags = val.data.match(new RegExp(str+'(.*?)Day<\/td>',"g"));   
      if (tags) {
        tags = tags.join(":");
        tags = tags.match(/National(.*?)Day/g);
      } else {
        tags = [];
      }
      callback(tags);
    });
};

function rnd(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
server.prepare()
  .then(()=> {
    app.get("/*",handle);
    app.post("/day",(req,res)=> {
      var date = req.body.date ? new Date(req.body.date.toString()) : new Date();
      if (req.body.random) {
        fetchData(date,(days)=> {
          res.json({day:days[rnd(0,days.length-1)],date:date});
        })
      } else {
        fetchData(date,(days)=> {
          res.send({"day":days,date:date})
        })
      }
    });
    app.get("/_next/*",handle);
    app.listen(3000, () => console.log("DayScraper is up and running on port 3000"));
  })