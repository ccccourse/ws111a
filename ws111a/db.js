import { DB } from "https://deno.land/x/sqlite/mod.ts";

let db = null
const NLIMIT = 100

export async function open() {
  db = new DB("web.db");
  db.query(`CREATE TABLE IF NOT EXISTS users 
              (uid INTEGER PRIMARY KEY AUTOINCREMENT, 
               user TEXT, pass TEXT, email TEXT)`)
  // https://www.sqlitetutorial.net/sqlite-full-text-search/
  // db.query(`CREATE VIRTUAL TABLE posts USING FTS5(title, body)`)
  db.query(`CREATE TABLE IF NOT EXISTS rank(user TEXT, click INTEGER NOT NULL)`)
}

export async function clear() {
  db.query(`DELETE FROM users`)
}

export async function close() {
  db.close()
}

export async function rankAdd(user){
  db.query(`INSERT INTO rank (user, click) VALUES (?,?)`, 
                        [user.user, user.click])
}

export async function userAdd(user) {
  db.query(`INSERT INTO users (user, pass, email) VALUES (?,?,?)`, 
                        [user.user, user.pass, user.email])
}

export async function userGet(user1) {
  let q = db.query(`SELECT uid, user, pass, email FROM users 
                    WHERE user=?`, [user1])
  console.log(`userGet(${user1})=${q}`)
  if (q.length <=0) return null
  let [uid, user, pass, email] = q[0]
  return {uid, user, pass, email}
}

export async function userList() {
  let q = db.query(`SELECT user FROM users`, [])
  let users = []
  for (let [user] of q) {
    users.push(user)
  }
  return users
}

export async function replyAdd(reply) {
  let time = reply.time || Date.now()
  db.query('INSERT INTO replys (mid, msg, user, time) VALUES (?,?,?,?)',
          [reply.mid, reply.msg, reply.user, time])
}

export async function msgAdd(msg) {
  let time=msg.time || Date.now()
  let r = db.query(`INSERT INTO msgs (msg, ufrom, uto, time) VALUES (?,?,?,?)`, 
    [msg.msg, msg.ufrom, msg.uto, time])
  r = db.query('SELECT last_insert_rowid()')
  let mid = r[0][0]
  let replys = msg.replys || []
  for (let reply of replys) {
    reply.mid = mid
    replyAdd(reply)
    // r = db.query('INSERT INTO replys (mid, msg, user, time) VALUES (?,?,?,?)',
    //  [mid, reply.msg, reply.user, time])
  }
  return mid
}

export async function msgGet(mid) {
  let q = db.query(`SELECT mid, msg, ufrom, uto, time
                    FROM msgs WHERE mid=?`, [mid])
  if (q.length <=0) return null
  let [_mid, msg, ufrom, uto, time] = q[0]
  q = db.query(`SELECT msg, user, time FROM replys WHERE mid=? ORDER BY time DESC`, [mid])
  let replys = []
  for (let [msg, user, time] of q) {
    replys.push({msg, user, time})
  }
  return {mid, msg, ufrom, uto, time, replys}
}

export function queryToMsgs(q) {
  let msgs = []
  for (let [mid, msg, ufrom, uto, time] of q) {
    msgs.push({mid, msg, ufrom, uto, time})
  }
  return msgs
}

export async function msgTo(user) {
  let q = db.query(`SELECT mid, msg, ufrom, uto, time
                    FROM msgs WHERE uto=? and uto!=ufrom 
                    ORDER BY time DESC LIMIT ${NLIMIT}`, [user])
  return queryToMsgs(q)
}

export async function msgBy(user) {
  let q = db.query(`SELECT mid, msg, ufrom, uto, time
            FROM msgs WHERE ufrom=? ORDER BY time DESC LIMIT ${NLIMIT}`, [user])
  return queryToMsgs(q)
}

export async function msgFollow(follower) {
  let q = db.query(`SELECT mid, msg, ufrom, uto, time FROM vFollowMsg 
                    WHERE follower=? ORDER BY time DESC LIMIT ${NLIMIT}`, [follower])
  return queryToMsgs(q)
}

export async function msgKey(key) {
  let q = db.query(`SELECT mid, msg, ufrom, uto, time FROM msgs 
                    WHERE LOWER(msg) LIKE '%${key.toLowerCase()}%'
                    ORDER BY time DESC LIMIT ${NLIMIT}`, [])
  return queryToMsgs(q)
}

export function followAdd(follower, user) {
  db.query(`INSERT INTO follows (follower, user) VALUES (?,?)`, 
                                [follower, user])
}

export async function followTo(user) {
  let q = db.query(`SELECT user FROM follows WHERE follower=?`, [user])
  let follows = []
  for (let [follow] of q) {
    follows.push(follow)
  }
  return follows
}

export async function followBy(user) {
  let q = db.query(`SELECT follower FROM follows WHERE user=?`, [user])
  let followers = []
  for (let [follower] of q) {
    followers.push(follower)
  }
  return followers
}
