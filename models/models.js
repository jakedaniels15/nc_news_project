const db = require('../db/connection')
const express = require("express");
const app = express();

app.use(express.json())

function fetchTopics(id){
    return db.query(`SELECT * FROM topics`).then(({rows}) => {
        return rows
    })
}

function fetchArticles(sort_by = 'created_at', order = 'desc', topic) {
  const columnsCanSort = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'];
  const orders = ['asc', 'desc'];

  if (!columnsCanSort.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid sort_by column' });
  }
  if (!orders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: 'Invalid order query' });
  }

  const queryValues = [];
  let topicFilter = '';
  if (topic) {
    topicFilter = `WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  const queryStr = `
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
    ${topicFilter}
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()};`;

  return db.query(queryStr, queryValues)
    .then(({ rows }) => {
      if (rows.length === 0 && topic) {
        return db.query('SELECT * FROM topics WHERE slug = $1;', [topic])
          .then(({ rows: topicRows }) => {
            if (topicRows.length === 0) {
              return Promise.reject({ status: 404, msg: 'Topic not found' });
            } else {
              
              return [];
            }
          });
      }
      return rows;
    });
}

function fetchUsers(id){
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows
    })
}

function fetchArticleId(article_id) {
  return db.query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,[article_id])

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function fetchArticleComments(id){
    return db.query(`SELECT * FROM comments
                    WHERE article_id = $1`, [id]).then(({rows}) =>{
        return rows
    })
}

function insertArticleComment(article_id, author, body){
    return db.query(`INSERT INTO comments
                    (article_id, author, body)
                    VALUES
                    ($1, $2, $3)
                    RETURNING *`, [article_id, author, body]).then(({rows}) => {
        return rows[0]
    })
}

function updateArticleVotes(article_id, inc_votes){
    return db.query(`UPDATE articles SET votes = votes + $1
                    WHERE article_id = $2
                    RETURNING *`, [inc_votes, article_id])
    .then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: "Article not found"})
        }
        return rows[0]
    })
}

function deleteArticleComment(comment_id){
    return db.query(`DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING *`, [comment_id]).then(({rows}) =>{
             if(rows.length === 0){
           return Promise.reject({status: 404, msg: "Comment not found"})
        }  
    return rows[0]
    })
}

module.exports = {
    fetchTopics,
    fetchArticles,
    fetchUsers,
    fetchArticleId,
    fetchArticleComments,
    insertArticleComment,
    updateArticleVotes,
    deleteArticleComment
    }