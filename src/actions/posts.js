import { db } from "../database.js"
import { recordNotFoundError } from "./erros/recordNotFoundError.js"

export const listPosts = (req,res) => {
    const posts = db.prepare('SELECT * from posts ORDER BY created_at DESC').all() // 
 //console.log(posts)
    
    // const posts2 = [{
    //     title:'mon titre',
    //     content:'mon contenu'
    // },{
    //     title:'mon second article',
    //     content:'mon second contenu'

    // }]
    res.view('templates/index.ejs', 
    {posts})
}

export const showPost = (req,res) => {
   const post = db.prepare(`SELECT * from posts WHERE id = ?`).get(req.params.id)
   console.log("le post : " + post)
   if (post === undefined) {
        throw new recordNotFoundError(`impossible de trouver l'article avec l'id ${req.params.id}`)
   }
    return res.view('templates/single.ejs', 
    {post})
}

export const createPost = (req,res) => {
    const post = db.prepare('INSERT INTO posts (title, content, created_at) VALUES (?,?,?) ')
  //  console.log(post)
    .run(
        req.body.title,
        req.body.content,
        Math.round(Date.now()/1000)
    )
    return res.redirect('/')
    // return req.body
 }