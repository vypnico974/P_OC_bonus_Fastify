import fastifyView from "@fastify/view"
import fastify from "fastify"
import fastifyStatic from '@fastify/static'
import ejs from "ejs"
import { fileURLToPath} from "node:url" 
import { dirname, join} from "node:path" 
import { createPost, listPosts, showPost } from "./actions/posts.js"
import { recordNotFoundError } from "./actions/erros/recordNotFoundError.js"
import fastifyFormbody from "@fastify/formbody"
import { loginAction, logoutAction } from "./actions/auth.js"


const app = fastify() 
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))


app.register(fastifyView, {
    engine:{
        ejs   // ejs:ejs
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
    }
    console.error(error)
    res.statusCode = 505
    return {
        error : error.message
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