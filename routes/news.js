var express = require("express");
var router = express.Router();

const config = require("../config");
const NewsAPI = require("newsapi");
const News = require("../models/news");
const newsapi = new NewsAPI(config.newsApiKey);
var moment = require("moment");

router.route("/v1/everything").get((req, res, next) => {
  newsapi.v2
    .everything({
      q: "Football",
      domains:
        "bbc.co.uk, bleacherreport.com, espn.go.com, football-italia.net, fourfourtwo.com, foxsports.com, talksport.com, thesportbible.com",
      language: "en",
      to: moment(new Date()).subtract(25, "h").toISOString(),
      from: moment(new Date()).subtract(48, "h").toISOString(),
      pageSize: 100,
    })
    .then(
      (news) => {
        News.insertMany(news.articles, (err, docs) => {
          if (err) {
            res.statusCode = 310;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: false, error: err });
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ success: true });
          }
        });
      },
      (err) => next(err)
    );
});

router.route("/v1/getNews").get((req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const itemLimit = 10;
  News.find({})
    .sort({ publishedAt: "desc" })
    .limit(itemLimit)
    .skip((page - 1) * itemLimit)
    .then(
      (news) => {
        res.statusCode = 310;
        res.setHeader("Content-Type", "application/json");
        res.json(news);
      },
      (err) => next(err)
    );
});

module.exports = router;
