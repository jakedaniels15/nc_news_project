const db = require("../connection")
const format = require('pg-format')
const {convertTimestampToDate, createLookupObject} = require('../seeds/utils');
const {
  articleData,
  commentData,
  topicData,
  userData,
  emojiData,
  followedTopicsData,
  articlesUserHasReactedToData
} = require('../data/development-data');

const seed = ({ topicData, userData, articleData, commentData }) => {
  // DROP TABLES IN REVERSE ORDER
  return db.query(`DROP TABLE IF EXISTS comments`)
    .then(() => db.query(`DROP TABLE IF EXISTS articles_reacted_to `))
    .then(() => db.query(`DROP TABLE IF EXISTS articles `))
    .then(() => db.query(`DROP TABLE IF EXISTS topics_followed `))
    .then(() => db.query(`DROP TABLE IF EXISTS users `))
    .then(() => db.query(`DROP TABLE IF EXISTS topics `))
    .then(() => db.query(`DROP TABLE IF EXISTS emojis`))

    

    // CREATE TABLES
    .then(() => db.query(`
      CREATE TABLE emojis (
      emoji_id SERIAL PRIMARY KEY,
      emoji VARCHAR(5),
      emoji_name VARCHAR(20)
      )`))
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
      CREATE TABLE topics_followed(
      user_topic_id SERIAL PRIMARY KEY,
      username VARCHAR(100) REFERENCES users(username),
      topic VARCHAR(100) REFERENCES topics(slug)
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
      CREATE TABLE articles_reacted_to (
      emoji_article_user_id SERIAL PRIMARY KEY,
      emoji_id INT REFERENCES emojis(emoji_id),
      username VARCHAR(100) REFERENCES users(username),
      article_id INT REFERENCES articles(article_id)
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
    // INSERT EMOJI DATA
    .then(() => {
      const formattedEmojiData = emojiData.map(({emoji, emoji_name}) => {
        return [emoji, emoji_name];
      });
      const sqlString = format(
        `INSERT INTO emojis(emoji, emoji_name) VALUES %L RETURNING *`,
        formattedEmojiData
      );
      return db.query(sqlString);
    })

    // INSERT TOPIC DATA
    .then(({ rows: emojiRows }) => {
      const formattedTopicData = topicData.map(({ description, slug, img_url }) => {
        return [description, slug, img_url];
      });
      const sqlString = format(
        `INSERT INTO topics(description, slug, img_url) VALUES %L RETURNING *`,
        formattedTopicData
      );
      return db.query(sqlString).then(({ rows: topicRows }) =>{
        return {emojiRows, topicRows}
      });
    })

    // INSERT USERS DATA
    .then(({ emojiRows, topicRows }) => {

      const formattedUsersData = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });
      const sqlString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *`,
        formattedUsersData
      );
      return db.query(sqlString).then(({rows : userRows}) => {
        
         return { emojiRows, topicRows, userRows }
      });
    })
    // INSERT TOPICS FOLLOWED DATA
    .then(({ emojiRows, topicRows, userRows }) => {
        const formattedFollowedTopicsData = followedTopicsData.map(({username, topic}) => {
          
        return [username, topic];
      });
      const sqlString = format(
        `INSERT INTO topics_followed(username, topic) VALUES %L RETURNING *`,
        formattedFollowedTopicsData
      );
      
      return db.query(sqlString).then(({rows}) => {
        return { emojiRows, topicRows, userRows }
      });
    })

    // INSERT ARTICLES DATA
    
    .then(({ emojiRows, topicRows, userRows }) => {
      const formattedArticlesData = articleData.map(({ title, topic, author, body, created_at, votes, article_img_url }) => {
        const formattedDate = new Date(created_at);
        return [title, topic, author, body, formattedDate, votes, article_img_url];
      });
        

      const sqlString = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticlesData
      );
      
      return db.query(sqlString).then(({rows : articleRows}) => {
        return { emojiRows, topicRows, userRows, articleRows }
      });
    })
    // INSERT ARTICLES_REACTED_TO DATA
    .then(({ emojiRows, topicRows, userRows, articleRows }) => {
      // const emojiLookupObj = createLookupObject(emojiRows, 'emoji', 'emoji_id')
      // const articleLookupObj = createLookupObject(articleRows, 'title', 'article_id')

  
      const formattedArticlesReactedToData = articlesUserHasReactedToData.map(({emoji_id, username, article_id}) => {
        // const emoji_id = emojiLookupObj[emoji]
        // const article_id = articleLookupObj[article_title]
        return [emoji_id, username, article_id]
      })

      const sqlString = format(`INSERT INTO articles_reacted_to(emoji_id, username, article_id) VALUES %L RETURNING *`, formattedArticlesReactedToData
      )
 
      return db.query(sqlString).then(() =>{

        return { emojiRows, topicRows, userRows, articleRows }
      })
    })

    // INSERT COMMENTS DATA
    .then(({ emojiRows, topicRows, userRows, articleRows }) => {
      const articleLookup = createLookupObject(articleRows, 'title', 'article_id');
      
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
