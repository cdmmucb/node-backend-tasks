//https://stackoverflow.com/questions/9177049/express-js-req-body-undefined

var express = require("express");
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

var app = express();

var tasks = []

var surrogateKey = 1;


app.get("/", (req, res, next) => {
    res.json("{ 'message': 'Tasks server online'}");
});

app.post("/tasks", jsonParser, (req, res, next) => {
    req.body.id = surrogateKey++;
    req.body.state = "pending";
    tasks.push(req.body);
    res.send("{'message':'Add successful'}");
});


app.get("/tasks", (req, res, next) => {
    res.json(tasks);
});


app.get('/tasks/:id', (req, res,next) =>{
    var result = search(req.params.id, tasks);
    res.json(result);
});

function search(id, array){
    for (var i=0; i < array.length; i++) {
        if (array[i].id == id) {
            return array[i];
        }
    }
}

function searchPosition(id, array){
    for (var i=0; i < array.length; i++) {
        if (array[i].id == id) {
            return i;
        }
    }
}

app.put("/tasks/:id", jsonParser, (req, res, next) => {
    const state = req.query.state;
    
    var task = search(req.params.id,tasks);
    
    if (state) {
 
        req.body.title = task.title;
        req.body.detail = task.detail;
        req.body.id = task.id;
        req.body.state = state;
        
    } else {
        req.body.id = task.id;
                req.body.state = task.state;
                
    }
    tasks.splice(searchPosition(task, tasks), 1, req.body);
        res.send("{'message':'Modification successful'}");
});


app.delete('/tasks/:id', function(req, res) {
    tasks.splice(searchPosition(req.params.id,tasks), 1);
    res.send("{'message':'Deletion successful'}");
});



app.listen(3000, () => {
    console.log("Servidor HTTP funcionando");
});