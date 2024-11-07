class PostOffice{
    static doGET(path, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            callback(xhr.responseText);
          } else {
            callback(null);
          }
        }
      };
      xhr.open("GET", path);
      xhr.send();
    }
    static async fetchAndParse(path){
      let res = await (await fetch("http://localhost:3000/api/"+path)).json()
      console.log("Received data")
      console.log(res)
      return res
    }
    static doPOSTJSON(path, dat, callback) {//Takes in json and sends json to callback
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            callback(xhr.responseText);
          } else {
            callback(null);
          }
        }
      };
      xhr.open("POST", path);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.send(JSON.stringify(dat));
    }
  }
  
  function handleFileData(fileData) {
    if (!fileData) {
      return;
    }
    console.log(fileData)
  } // Do the request
  PostOffice.doGET("./test.txt", handleFileData);
  PostOffice.doGET("http://localhost:3000/testget", handleFileData);
  PostOffice.doGET("http://localhost:3000/monster/storrm21", handleFileData);
  PostOffice.doPOSTJSON("http://localhost:3000/egg", {json:"json", test:"odc"}, handleFileData);

//Game online options
//Full online(all actions are stored in player database) - prevents cheating
//Semi-online(actions stored locally, but query server for game secrets like breeding) - good for slow internet users but still hides game secrets
//Full offline(all actions are stored locally and secret game code is open source) - good for non-internet users but allows cheating and game secrets to be found