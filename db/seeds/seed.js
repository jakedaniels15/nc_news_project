const db = require("../connection")

const seed = ({ topicData, userData, articleData, commentData }) => {
  //DROP TABLES IN REVERSE ORDER TO CREATE
  return db.query(`DROP TABLE IF EXISTS comments`).then(() =>{
  return db.query(`DROP TABLE IF EXISTS articles`).then(() => {
  return db.query(`DROP TABLE IF EXISTS users`).then(() => {
  return db.query(`DROP TABLE IF EXISTS topics`).then(() => {
  //CREATE TABLES  
  return db.query(`CREATE TABLE topics (
                    description VARCHAR(100) NOT NULL,
                    slug VARCHAR(100) PRIMARY KEY,
                    img_url VARCHAR(1000) )`).then(()=>{
  return db.query(`CREATE TABLE users (
                    username VARCHAR(100) PRIMARY KEY,
                    name VARCHAR(30) NOT NULL,
                    avatar_url VARCHAR(1000) )`).then(() => {
  return db.query(`CREATE TABLE articles (
                    article_id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    topic VARCHAR(100)  NOT NULL REFERENCES topics(slug),
                    author VARCHAR(30) NOT NULL REFERENCES users(username),
                    body TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    votes INT DEFAULT 0 ,
                    article_img_url VARCHAR(1000) )`).then(() => {
  return db.query(`CREATE TABLE comments (
                    comment_id SERIAL PRIMARY KEY,
                    article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
                    body TEXT NOT NULL,
                    votes INT DEFAULT 0,
                    author VARCHAR(30)  NOT NULL REFERENCES users(username) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`)                    
              })
            })
          })
        })
      })
    })
  })
};
module.exports = seed;
