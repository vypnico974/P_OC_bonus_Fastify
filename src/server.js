import fastifyView from "@fastify/view"
import fastify from "fastify"
import fastifyStatic from '@fastify/static'
import ejs from "ejs"
import { fileURLToPath} from "node:url" 
import { dirname, join} from "node:path" 
import { db } from "./database.js"


const app = fastify() 
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))


app.register(fastifyView, {
    engine:{
        ejs   // ejs:ejs
    }
})

app.register(fastifyStatic, {
  root: join(rootDir, 'public'),
 // prefix: '/public/', // optional: default '/'
 // constraints: { host: 'example.com' } // optional: default {}
})

app.get('/', (req,res) => {
    const posts = db.prepare('SELECT * from posts').all()
    console.log(posts)
    
    const posts2 = [{
        title:'mon titre',
        content:'mon contenu'
    },{
        title:'mon second article',
        content:'mon second contenu'

    }]
    res.view('templates/index.ejs', 
    {posts})
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