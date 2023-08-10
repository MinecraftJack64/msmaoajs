/*//Load HTTP module
const http = require("http");
//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {
  //Set the response HTTP header with HTTP status and Content type
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/
//import {t} from "/modules/utilities.js"
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const express = require('express')
const socketio = require('socket.io')
const crypto = require('crypto')
const session = require('express-session')
const fs = require('fs')
const hostname = "127.0.0.1";

const app = express();
const server = require('http').createServer(app)
const io = socketio(server)
const port = 3000;

app.set('view engine', 'pug')
app.set('views', './views')

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({saveUninitialized: true, resave: true, secret:"ogbdfoodbkfpobfskpod32332323|_+sevsdvv//?~ZZ"}))

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})
io.on('message', (socket)=>{
  console.log("message received")
  socket.emit('messagereturn')
})
app.get('/testsocket', (req, res)=>{
  res.sendFile(__dirname+'/testsocket.html')
})

var Users = [{id: "test", password: "pass"}]

const DL = {};

function dig(path, root) {
  const dirents = fs.readdirSync(path, { withFileTypes: true });
  
  dirents.forEach((dirent) => {
    if (dirent.isDirectory()) {
      root[dirent.name] = {};
      dig(path + '/' + dirent.name, root[dirent.name]);
    } else {
      if (!root.files) {
        root.files = [];
      }
      root.files.push(dirent.name);
    }
  });
}
dig(__dirname+"/gamedata/meta", DL)

//TEMPLATE EXAMPLES
app.get('/testget', (req, res) => {
    res.send("Request complete")
});
app.get('/monster/:idd', (req, res) => {
  res.send("You wanted monster id "+req.params.idd)
});
app.post('/egg', (req, res) => {//req.body is real json
  console.log(req.body)
  res.json(req.body)
});
//REAL CODE
app.get('/api/gamedata/*', (req, res) => {
  console.log(req.params[0])
  if(req.params[0]==="downloadlist"){
    console.log(DL)
    res.json(DL)
    return
  }
  res.sendFile("./gamedata/meta/"+req.params[0], {root: __dirname})
});
//NumerIt code
function hash(value){
  const hash = crypto.createHash('sha256');
  hash.update(value);
  return hash.digest('hex');
}
app.get('/signup', (req, res)=>{
  res.render('signup')
});
app.get('/login', (req, res)=>{
  res.render('login')
});
app.post('/signup', (req, res)=>{
  if(!req.body.id || !req.body.password){
    res.render('signup', {message: "id or password are missing"})
  }else{
    if(Users.some((user)=>user.id===req.body.id)){
      res.render('signup', {message: "id already being used, pick another"})
    }else{
      Users.push({id:req.body.id, password:hash(req.body.password)})
      console.log(Users)
      res.redirect('/login')
    }
  }
});
app.post('/login', (req, res)=>{
  if(!req.body.id || !req.body.password){
    res.render('login', {message: "id or password are missing"})
  }else{
    let loggedin = false
    Users.filter(function(user){
      if(user.id===req.body.id && user.password===hash(req.body.password)){
        req.session.user = user;
        res.redirect('/welcome')
        loggedin = true
      }
    });
    if(!loggedin){
      res.render('login', {message: "Invalid login"})
    }
  }
})
app.get('/logout', function(req, res){
  req.session.destroy(function(){
    console.log("User logged out")
  })
  res.redirect('/login')
})
function checkLogin(req, res, next){
  if(req.session.user){
    next();
  }else{
    var err = new Error("Not logged in")
    next(err);
  }
}
app.get('/welcome', checkLogin, (req, res)=>{
  let user = Users.find(val=>val.id===req.session.user.id)
  if(!user.favnum){
    res.redirect('/setnum')
  }else{
    res.render('welcome', {id: req.session.user.id, num: user.favnum})
  }
})
app.get('/setnum', checkLogin, (req, res)=>{
  res.render('setnum')
})
app.post('/setnum', checkLogin, (req, res)=>{
  if(!req.body.num){
    res.render('setnum', {message: "Please enter a number"})
  }else{
    let user = Users.find(val=>val.id===req.session.user.id)
    user.favnum = req.body.num
    res.render('setnum', {message: "Successful"})
  }
})
app.get('/', (req, res)=>{
  res.render('main')
})
app.get('/delete', checkLogin, (req, res)=>{
  res.render('delete', {id: req.session.user.id})
})
app.post('/delete', (req, res)=>{
  Users = Users.filter((val)=>val.id!==req.session.user.id)
  req.session.destroy(function(){
    console.log("User deleted")
  })
  res.redirect('/signup')
})
app.use('/welcome', (err, req, res, next)=>{
  console.log(err)
  res.redirect('/login')
})
app.use('/delete', (err, req, res, next)=>{
  console.log(err)
  res.redirect('/login')
})
app.use('/setnum', (err, req, res, next)=>{
  console.log(err)
  res.redirect('/login')
})
server.listen(port, () => console.log(`Le serveur est listener sur porte ${port}!`));