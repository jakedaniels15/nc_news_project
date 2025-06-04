const db = require('./db/connection')
const express = require("express");
const app = express();
const {getTopics, getArticles, getUsers, getArticleId} = require('./controllers/controllers')


app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticleId)



app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!"});
});

module.exports = app