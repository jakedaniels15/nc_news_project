const db = require("./connection")

//Print users
db.query(`SELECT * FROM users`)
    .then((result) =>{
    console.log(result.rows)
})

//Print all the articles where the topic is coding
db.query(`SELECT * FROM articles 
        WHERE articles.topic = 'coding'`)
    .then((result) =>{
    console.log(result.rows)
})
//Print all comments where votes are less than zero
db.query(`SELECT * FROM comments
            WHERE comments.votes < 0`).then((result) =>{
    console.log(result.rows)
})
//Print all topics
db.query(`SELECT * FROM topics`).then((result) =>{
    console.log(result.rows)
})
//Print all articles by grumpy19
db.query(`SELECT * FROM articles
        WHERE articles.author = 'grumpy19'`).then((result) =>{
    console.log(result.rows)
})
//Print all comments that have more than 10 votes
db.query(`SELECT * FROM comments
            WHERE comments.votes > 10`).then((result) =>{
    console.log(result.rows)
})