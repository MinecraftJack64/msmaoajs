const children = ['cloud']
function mine(){
  var obj = {}
  for(var j = 0; j < children.length; j++){
    let x = import("./"+children[j]+"/loader.js")
    //console.log(x)
    obj[children[j]] = x.default
  }
  return obj
}
//export default mine()
//console.log(mine()['cloud'])