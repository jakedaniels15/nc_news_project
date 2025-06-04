const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/development-data")
const request = require('supertest');
const app = require('../app')

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})


describe("GET /api", () => {
  test.skip("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object with the key of topics and the value of an array of topic objects. Which each have a 'slug' and 'description' property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty('topics')
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug")
          expect(topic).toHaveProperty("description")
        })
      })
  })
})

describe("GET /api/articles", () => {
  test(`200: Responds with an object with the key of articles and the value of 
        of an array of article object. Each object should have properties of: 
        author, title, article_id, topic, created_at, votes, article_img_url, comment_count`, () => {
  return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty('articles')
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes")
          expect(article).toHaveProperty("article_img_url")
          expect(article).toHaveProperty("comment_count")
        })
    })
  })
})

describe("GET /api/users", () => {
  test(`200: Responds with an object with the key of users and the value
      of an array of objects. Each object should have the properties:
      username, name, avatar_url`, () => {
  return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty('users')
        body.users.forEach((user) => {
          expect(user).toHaveProperty('username')
          expect(user).toHaveProperty('name')
          expect(user).toHaveProperty('avatar_url')
        })
      })
    })
})

describe("GET /api/articles/:article_id", () => {
  test(`200: Responds with an object with the key of article and the value of
      an article object, which should have the following properties:
      author, title, article_id, body, topic, created_at, votes, article_img_url`, () => {
    return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({body}) =>{
        
          expect(body).toHaveProperty('article')
          const article = body.article
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id")
          expect(article).toHaveProperty("body")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes")
          expect(article).toHaveProperty("article_img_url")
          })
        })
  test(`Returns a 404 error when article_id provided is not found`, () => {
    return request(app)
        .get("/api/articles/150")
        .expect(404)  
  })
   test(`Returns a 400 error when an invalid article_id is provided`, () => {
    return request(app)
        .get("/api/articles/jake")
        .expect(400)  
  })
})