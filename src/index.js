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

const connectDB = require("./db");
//Connecting the Database
connectDB();
app.use("/api/auth", require("./auth/route"))

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
require('./routes/tests/debug')(app);
//REAL CODE
app.get('/api/gamedata/*', (req, res) => {
  console.log(req.params[0]+" was requested")
  if(req.params[0]==="downloadlist"){
    console.log("Download list returned")
    res.json(DL)
    return
  }
  console.log("Request fulfilled")
  res.sendFile("./gamedata/meta/"+req.params[0], {root: __dirname})
});
//NumerIt code
require('./routes/tests/numerit')(app);
server.listen(port, () => console.log(`Le serveur est listener sur porte ${port}!`));

process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})