import fastifyView from "@fastify/view"
import fastify from "fastify"
import fastifyStatic from '@fastify/static'
import {fastifySecureSession} from '@fastify/secure-session'
import ejs from "ejs"
import { fileURLToPath} from "node:url" 
import { dirname, join} from "node:path" 
import { createPost, listPosts, showPost } from "./actions/posts.js"
import { recordNotFoundError } from "./actions/erros/recordNotFoundError.js"
import fastifyFormbody from "@fastify/formbody"
import { loginAction, logoutAction } from "./actions/auth.js"
import { readFileSync } from "node:fs"
import { notAuthenticError } from "./actions/erros/notAuthenticError.js"


const app = fastify() 
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))


app.register(fastifyView, {
    engine:{
        ejs   // ejs:ejs
    }
})

app.register(fastifySecureSession, {
    // the name of the attribute decorated on the request-object, defaults to 'session'
    sessionName: 'session',
    // the name of the session cookie, defaults to value of sessionName
    cookieName: 'my-session-cookie',
    // adapt this to point to the directory where secret-key is located
    key: readFileSync(join(rootDir, 'secret-key')),
    cookie: {
      path: '/'
      // options for setCookie, see https://github.com/fastify/fastify-cookie
    }
})

app.register(fastifyFormbody)

app.register(fastifyStatic, {
  root: join(rootDir, 'public'),
 // prefix: '/public/', // optional: default '/'
 // constraints: { host: 'example.com' } // optional: default {}
})

app.get('/', listPosts)
app.post('/', createPost)
app.get('/login', loginAction)
app.post('/login', loginAction)
app.post('/logout', logoutAction)
app.get('/article/:id', showPost)
app.setErrorHandler((error,req,res) => {
    if (error instanceof recordNotFoundError){
        res.statusCode = 404
        return res.view('templates/404.ejs',{
            error: 'Cette enregistrement n\'existe pas'
        })
    } else if (error instanceof notAuthenticError) {
        res.redirect('/login')
    }
    console.error(error)
    res.statusCode = 505
    return {
        error : 'message d\'erreur: ' + error.message
    }
})

const start = async () => {
    try {
        await app.listen({port:3000})
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}
start()