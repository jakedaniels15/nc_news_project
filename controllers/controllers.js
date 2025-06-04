const db = require('../db/connection')
const {fetchTopics, fetchArticles, fetchUsers, fetchArticleId} = require('../models/models')

function getTopics(req, res, next){
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
    next(err)
  })
}

function getArticles(req, res, next){
    fetchArticles().then((articles) =>{
        res.status(200).send({articles})
    })
    .catch((err) => {
    next(err)
  })
}

function getUsers(req, res, next){
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
    next(err)
  })
}

function getArticleId(req, res, next){
    const id = Number(req.params.article_id)
if(isNaN(id)){
    return res.status(400).send({msg: "Invalid article_id"})
}
    fetchArticleId(id).then((article) =>{
        if(!article){
            return res.status(404).send({msg: "article not found"})
        }
        res.status(200).send({article})
    })
     .catch((err) => {
    next(err)
  })
}


module.exports = {getTopics, getArticles, getUsers, getArticleId}
