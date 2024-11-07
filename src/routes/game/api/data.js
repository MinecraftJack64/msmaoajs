module.exports = function(app, fs, ogdirname){
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
dig(ogdirname+"gamedata/meta", DL)
app.get('/api/gamedata/*', (req, res) => {
    console.log(req.params[0])
    if(req.params[0]==="downloadlist"){
      console.log(DL)
      res.json(DL)
      return
    }
    res.sendFile("./gamedata/meta/"+req.params[0], {root: __dirname})
  });
}