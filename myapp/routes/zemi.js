var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'zemi'
});

con.connect((err) =>{
  if(err){
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success to connection mysql server!!')
});

router.use(cors());
router.use(express.json())

/* GET users listing. */
router.get('/select', function(req, res, next) {
  con.query('select * from todo', function(error, results, fields){
    if(error) throw error;
    res.send(results)
  });
});

router.get('/desc', function(req,res,next){
  console.log("request param:"+req.query.id)
  const q = "select * from todo where ?;"
  con.query(q, {todo_id: req.query.id}, (err, results, fields)=>{
    console.log("desc results:"+results)
    if(err) throw err;
    console.log("success to get desc!!")
    res.send(results)
  })
})

router.post('/insert', function(req, res, next){
  const p_title = req.body.Todo
  const p_todo = req.body.Desc
  console.log(p_todo + p_title)
  const q = "insert into todo(title, todo, flag, date) values (?, ?, 0, now());";
  con.query(q ,[p_title, p_todo], (error, results, fields)=>{
    console.log(fields)
    if(error) throw error;
    console.log("success to insert todo!!");
    res.send("success to insert todo!!")
  })
})

module.exports = router;