const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sourceSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const newsSchema = new Schema({
  source: sourceSchema,
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  urlToImage: {
    type: String,
    required: false,
    default: "",
  },
  publishedAt: {
    type: Date,
    required: true,
  },
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
