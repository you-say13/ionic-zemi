const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'zemi',
  stringifyObjects: true,
});

function valiadation(text1, text2){
  if(text1 == null || text1.length > 20 && text2.length > 100){
    return false
  }else{
    return true
  }
}

con.connect((err) =>{
  if(err){
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success to connection mysql server!!')
});

router.use(cookieParser())
router.use(cors());
router.use(express.json())

/* GET todo listing. */
router.get('/select', function(req, res, next) {
  con.query('select * from todo', function(error, results, fields){
    if(error) throw error;
    res.send(results)
  });
});

router.get('/desc', function(req,res,next){
  const id = req.query.id
  console.log("request param:"+id)
  const q = "select * from todo where todo_id=?;"
  con.query(q, [id], (err, results, fields)=>{
    console.log("desc results:"+results)
    if(err) throw err;
    console.log("success to get desc!!")
    res.send(results)
  })
})

router.get('/update', function(req, res, next){
  const q = "update todo set flag = 1 where todo_id=?;";
  con.query(q, [req.query.id], (err, results, fields)=>{
    if(err)throw err;
    console.log("success update flag!");
    res.send(results)
  })
})

router.get('/delete', function(req, res, next){
  const q = "delete from todo where todo_id=?;";
  con.query(q, [req.query.id], (err, results, fields)=>{
    if(err)throw err;
    console.log("success delete flag!");
    res.send(results)
  })
})

router.get('/insert', function(req, res, next){
  const p_title = req.query.Todo
  const p_todo = req.query.Desc
  console.log("request data:"+req)
  if(!valiadation(p_title, p_todo)){
    res.send("bad request")
  }else{
    const q = "insert into todo(title, todo, flag, date, userid) values (?, ?, 0, now(), ?);";
    con.query(q ,[p_title, p_todo, req.cookies.username], (error, results, fields)=>{
      console.log(fields)
      if(error) throw error;
      console.log("success to insert todo!!");
      res.send("success to insert todo!!")
    })
  }

})
//新規登録
router.get('/signup', function(req, res, next){
  const q = "select username from user where name=?;";
  con.query(q, [req.query.name], (err, results, fields)=>{
    if(results == req.query.name){
      res.render("同一人物が存在します")
    }
  })
})
//ログイン
router.get('/signin', function(req, res, next){
  const upass = req.query.pass
  const uemail = req.query.email

  console.log(upass+uemail)
  if(upass == null || uemail == null){
    res.send("fuckin error")
  }else{
    const q = "select * from user where email=? and password=?";
    con.query(q,[uemail, upass], (err, results, fields)=>{
      if(err) throw err;
      if(results == "" || results == null){
        res.send({string:"内容に間違いがあります"})
      }else{
        console.log("users_id is "+results[0].user_id)
        res.send({id:results[0].user_id})
      }

    })
  }
})

module.exports = router;