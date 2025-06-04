const db = require('../db/connection')
const express = require("express");
const app = express();

app.use(express.json())

function fetchTopics(id){
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows
    })
}

function fetchArticles(id){
    return db.query(`
    SELECT 
      articles.author,
      articles.title,
      articles.article_id,
      articles.topic,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
  `)
    .then(({rows}) => {
        return rows
    })
}

function fetchUsers(id){
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows
    })
}

function fetchArticleId(id){
    return db.query(`SELECT * FROM articles 
                    WHERE article_id = $1`, [id]).then(({rows}) => {
        return rows[0] || null
    })
}

function fetchArticleComments(id){
    return db.query(`SELECT * FROM comments
                    WHERE article_id = $1`, [id]).then(({rows}) =>{
        return rows
    })
}

module.exports = {fetchTopics, fetchArticles, fetchUsers, fetchArticleId, fetchArticleComments}