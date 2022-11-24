const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
router.use(cors());
router.use(express.json())


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'zemi',
  stringifyObjects: true,
});

con.connect((err) =>{
  if(err){
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success to connection mysql server!!')
});


/* GET todo listing. */
router.post('/select', [
  check('user_id').not().isEmpty().isNumeric()
],function(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    const id = req.body.user_id
    const q = 'select * from todo where userid=?'
      con.query(q, [id], function(error, results, fields){
        if(error) throw error;
        res.send(results)
      });
  }

});

router.post('/desc', [
  check('id').not().isEmpty().isNumeric()
], function(req,res,next){
  const id = req.body.id
  console.log("request param:"+id)
  const q = "select * from todo where todo_id=?;"
  con.query(q, [id], (err, results, fields)=>{
    console.log("desc results:"+results)
    if(err) throw err;
    console.log("success to get desc!!")
    res.send(results)
  })
})

router.post('/update', [
  check('todo_id').not().isEmpty().isNumeric()
],function(req, res, next){
  const q = "update todo set flag = 1 where todo_id=?;";
  con.query(q, [req.body.todo_id], (err, results, fields)=>{
    if(err)throw err;
    console.log("success update flag!");
    res.send(results)
  })
})

router.post('/delete',[
  check('todo_id').not().isEmpty().isNumeric()
], function(req, res, next){
  const q = "delete from todo where todo_id=?;";
  con.query(q, [req.body.todo_id], (err, results, fields)=>{
    if(err)throw err;
    console.log("success delete flag!");
    res.send(results)
  })
})

router.post('/insert', [
  check('title').not().isEmpty().isLength({min:1, max:20}),
  check('desc').isLength({min:0, max:100}),
  check('user_id').not().isEmpty().isNumeric()
], function(req, res){
  const errors = validationResult(req);

  console.log(req.body.title)

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{

    const p_title = req.body.title
    const p_todo = req.body.desc || ""
    const p_id = req.body.user_id

    console.log(p_todo)
  
    const q = "insert into todo(title, todo, flag, date, userid) values (?, ?, 0, now(), ?);";
    con.query(q ,[p_title, p_todo, p_id], (error, results, fields)=>{
      console.log("success to insert todo!!");
      res.send({message:"success to insert todo!!", flag:1})
    })
  }
})

router.post("/prog",function(req, res){
  const flag = req.body.flag
  const id = req.body.user_id
  const q = "select * from todo where userid=? and flag=?"

  con.query(q, [id, flag], (err, results, fields)=>{
    if(err) throw err;
    res.send(results)
  })
})


//新規登録
router.post('/signup', [
  check('name').not().isEmpty().isLength({min:1, max:20}),
  check('email').not().isEmpty().isLength({min:5, max:30}).isEmail(),
  check('pass').not().isEmpty().isLength({mix:6, max:12})
],function(req, res, next){

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    const name = req.body.name
    const email = req.body.email
    const pass = req.body.pass

    var q = "select username from user where name=?;";
    con.query(q, [name], (err, results, fields)=>{
      if(results == name){
        res.send({message:"同一名が存在しますので変更してください", flag:0})
      }else{
        q = "insert into user (name, email, password, date) values(?, ?, ?, now())"
        con.query(q, [name, email, pass], (err, results, fields)=>{
          if(err) throw err;
          res.send({message:'"success', flag:1})
        })
      }
    })
  }
})
//ログイン
router.post('/signin',function(req, res, next){
  try{
      if(!req.headers.authorization){
    console.log("unAuthorize...")
    return res.send({message:"unAuthorize", flag:-1})
  }else{
    console.log("Authorized!!")
  }
  const auth = Buffer.from(req.headers.authorization, 'base64').toString()
  const str = auth.split(':');

  if(!(str[0].length >= 1) || !(str[0].length <= 20) || !(str[1].length >= 6) || !(str[1].length <= 12)){
    return res.send({message:"bad request(name or password)", flag:-1})
  }

  const q = "select * from user where name=? and password=?";
  con.query(q,[str[0], str[1]], (err, results, fields)=>{
    if(err) throw '失敗しました';
    if(results == "" || results == null){
      return res.send({message:"内容に間違いがあります", flag:0})
    }else{
      const payload = {
        id: results[0].user_id,
        name: str[0],
        pass: str[1],
      }
      const token = jwt.sign(results[0].user_id, "ionic-zemi-secret-key")
      return res.send({message:"ログインしました", flag:1, token})
    }
  })
  }catch(err){
    console.log(err)
  }

})

module.exports = router;