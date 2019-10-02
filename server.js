const express = require("express");
const axios = require("axios");
const next = require("next");
const app = express();

const dev = process.env.NODE_ENV !== 'production';
const server = next({ dev });
const handle = server.getRequestHandler();

const monthNames = ["january", "february", "march", "april", "may", "june","july", "august", "september", "october", "november", "december"];


function fetchData (date,callback) {
  var str = `<a href="\/day\/${monthNames[date.getMonth()]}-${date.getDate()}\/">`;
  var url = "http://www.holidayscalendar.com/categories/weird/";
  const result = axios.get(url)
    .then((val)=> {
      var tags = val.data.match(new RegExp(str+'(.*?)Day<\/td>',"g"));   
      tags = tags.join(":");
      tags = tags.match(/National(.*?)Day/g);
      callback(tags);
    });
};

server.prepare()
  .then(()=> {
  app.get("/",handle);
  
  app.listen(3000, () => console.log("DayScraper is up and running on port 3000"));
  })