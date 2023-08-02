import { db } from "../database.js"
import {hash, verify} from "phc-argon2"

export const params_error = ""

export const loginAction = async (req,res) => {
   
    const params = {}
    if (req.method === 'POST') {
        
        const {username, password} = req.body
        params.username = username
        const user = db.prepare('SELECT * from users where username = ?').get(username)
       // console.log(user)
       if (
            username !== undefined &&
            (await verify(user.password, password))

       ) {
            req.session.set('user',{
                id: user.id,
                username: user.username
            })
            return res.redirect('/')
            //return 'connecté'
       }
        params.error = 'identifiants invalides'
    }
    //console.log("loginAction")

    return res.view('templates/login.ejs', params)
}

export const logoutAction = (req,res) => {
    req.session.delete()
    return res.redirect('/login')
   // return 'logout'
}