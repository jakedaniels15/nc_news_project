const db = require("../connection")
const format = require('pg-format')
const {convertTimestampToDate, createLookupObject} = require('../seeds/utils');
const { commentData } = require("../data/test-data")

const seed = ({ topicData, userData, articleData, commentData }) => {
  // DROP TABLES IN REVERSE ORDER
  return db.query(`DROP TABLE IF EXISTS comments`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles`))
    .then(() => db.query(`DROP TABLE IF EXISTS users`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics`))
    

    // CREATE TABLES
    .then(() => db.query(`
      CREATE TABLE topics (
        description VARCHAR(100) NOT NULL,
        slug VARCHAR(100) PRIMARY KEY,
        img_url VARCHAR(1000)
      )`))
    .then(() => db.query(`
      CREATE TABLE users (
        username VARCHAR(100) PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        avatar_url VARCHAR(1000)
      )`))
    .then(() => db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        topic VARCHAR(100) NOT NULL REFERENCES topics(slug),
        author VARCHAR(100) NOT NULL REFERENCES users(username),
        body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)
      )`))
    .then(() => db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT NOT NULL,
        votes INT DEFAULT 0,
        author VARCHAR(100) NOT NULL REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`))

    // INSERT TOPIC DATA
    .then(() => {
      const formattedTopicData = topicData.map(({ description, slug, img_url }) => {
        return [description, slug, img_url];
      });
      const sqlString = format(
        `INSERT INTO topics(description, slug, img_url) VALUES %L RETURNING *`,
        formattedTopicData
      );
      return db.query(sqlString);
    })

    // INSERT USERS DATA
    .then(() => {
      const formattedUsersData = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
        formattedUsersData
      );
      return db.query(sqlString);
    })

    // INSERT ARTICLES DATA
    .then(() => {
      const formattedArticlesData = articleData.map(({ title, topic, author, body, created_at, votes, article_img_url }) => {
        const formattedDate = new Date(created_at);
        return [title, topic, author, body, formattedDate, votes, article_img_url];
      });
      const sqlString = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticlesData
      );
      return db.query(sqlString);
    })

    // INSERT COMMENTS DATA
    .then(({ rows }) => {
      const articleLookup = createLookupObject(rows, 'title', 'article_id');
      
      const formattedCommentsData = commentData.map(({ article_title, body, votes, author, created_at }) => {
        const formattedDate = new Date(created_at);
        const article_id = articleLookup[article_title];
        return [article_id, body, votes, author, formattedDate];
      });

      const sqlString = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
        formattedCommentsData
      );
      return db.query(sqlString);
    });
};
module.exports = seed;
