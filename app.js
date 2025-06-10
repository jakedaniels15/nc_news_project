const db = require('./db/connection')
const express = require("express");
const app = express();
const {
    getTopics,
    getArticles,
    getUsers,
    getArticleId,
    getArticleComments, 
    postArticleComment,
    patchArticleVotes,
    removeArticleComment} = require('./controllers/controllers')


app.use(express.json())

app.get("/api", (req, res) => {
  res.json({
    endpoints: {
      topics: "/api/topics",
      articles: "/api/articles",
      users: "/api/users",
      "get article by ID": "/api/articles/:article_id",
      "get article comments": "/api/articles/:article_id/comments",
      "post article comment": "/api/articles/:article_id/comments",
      "patch article votes": "/api/articles/:article_id",
      "delete article comment": "/api/comments/:comment_id"
    }
  });
});

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticleId)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch("/api/articles/:article_id", patchArticleVotes)

app.delete("/api/comments/:comment_id", removeArticleComment)




app.use((err, req, res, next) => {

    if (err.status && err.msg) {
        return res.status(err.status).send({ msg: err.msg });
    }

    if(err.code === '22P02'){
        return res.status(400).send({msg: 'Invalid input'})
    }

    if(err.code === '23503'){
        return res.status(404).send({msg: 'Resource not found'})
    }

    if(err.code === '23502'){
        return res.status(400).send({msg : 'Missing required field(s)'})
    }
  console.log(err);
  res.status(500).send({ msg: "Server Error!"});
});

module.exports = app