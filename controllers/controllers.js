const db = require('../db/connection')
const {
    fetchTopics,
    fetchArticles,
    fetchUsers,
    fetchArticleId,
    fetchArticleComments,
    insertArticleComment,
    updateArticleVotes,
    deleteArticleComment} = require('../models/models')

function getTopics(req, res, next){
    fetchTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

function getArticles(req, res, next){

    const { sort_by = "created_at", order = "desc", topic} = req.query

    fetchArticles(sort_by, order, topic).then((articles) =>{
        res.status(200).send({articles})
    })
    .catch(next)
}

function getUsers(req, res, next){
    fetchUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
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
     .catch(next)
}

function getArticleComments(req, res, next){
        const id = Number(req.params.article_id)
    if(isNaN(id)){
        next({ status: 400, msg: "Invalid article_id" });
    }
    fetchArticleComments(id).then((comments) => {
        res.status(200).send({comments})
    })
     .catch(next)
}


function postArticleComment(req, res, next){
     const article_id = Number(req.params.article_id)
     const {author, body} = req.body

    if(isNaN(article_id)){
        return next({ status: 400, msg: "Invalid article_id" });
    }
    if(!author || !body){
        return next({status: 400, msg: "Missing required fields"})
    }
    insertArticleComment(article_id, author, body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
}

function patchArticleVotes(req, res, next){
    const article_id = Number(req.params.article_id)
     const {inc_votes} = req.body

       if(isNaN(article_id)){
        return next({ status: 400, msg: "Invalid article_id" });
    }

        if(typeof inc_votes !== 'number'){
            return res.status(400).send({msg : "Invalid vote increment"})
        }

    updateArticleVotes(article_id, inc_votes).then((updatedArticle) =>{
        res.status(200).send({article : updatedArticle})
    })
    .catch(next)
}

function removeArticleComment(req, res, next){
    const {comment_id} = req.params

        if(isNaN(comment_id)){
        return next({ status: 400, msg: "Invalid comment_id" });
    }
        deleteArticleComment(comment_id).then(() => {
            res.status(204).send()
        })
    .catch(next)
}



module.exports = {
    getTopics,
    getArticles,
    getUsers,
    getArticleId,
    getArticleComments,
    postArticleComment,
    patchArticleVotes,
    removeArticleComment}
