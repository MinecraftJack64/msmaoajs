crypto = require('crypto')
module.exports = function(app){
  var Users = []

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
}