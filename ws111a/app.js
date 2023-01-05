import * as db from './db.js'
import {Server, sendJson, bodyParams, sendStatus, Status} from './server.js'

db.open()

const server = new Server()
server.public("/public")

server.router.get('/', home)
.post('/login', login)
.post('/signup', signup)
.post('/rank', rank)


async function home(ctx) {
    ctx.response.redirect("/public/#home")
}

async function signup(ctx) {
  const params = await bodyParams(ctx)
  console.log('params=', params)
  let user = await db.userGet(params.user)
  if (user == null) { // user name available
    console.log('signup:params=', params)
    await db.userAdd({user:params.user, pass:params.password, email:params.email})
    sendStatus(ctx, Status.OK)
  }
  else
    sendStatus(ctx, Status.Fail)
}

async function login(ctx) {
  const params = await bodyParams(ctx)
  let user = await db.userGet(params.user)
  console.log('login:user=', user)
  if (user != null && user.pass == params.password) {
    await ctx.state.session.set('user', user)
    sendStatus(ctx, Status.OK)
  } else
    sendStatus(ctx, Status.Fail)
}

async function rank(ctx){
  let user = await ctx.state.session.get('user')
  console.log('user=',user.user)
  const params = await bodyParams(ctx)
  let user1 = params.user
  console.log('user1=',user1)
  let click = params.c
  console.log('click=',click)
  let player = {user:user, click:click}
  if(user.user == user1){
    console.log("error")
    await db.rankAdd(player)
    sendStatus(ctx, Status.OK)
  }
  else{sendStatus(ctx, Status.Fail)}
}

await server.listen(8000)
