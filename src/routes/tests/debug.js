module.exports = function(app){
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
}