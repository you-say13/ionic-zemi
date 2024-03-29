const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser')
const rate = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//const addr = require('../../src/address')
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

// const limit = rate({
//   windowMs: 1000 * 60,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false
// });

const customlimit = rate({
  windowMs: 1000*60,
  max: 100,
  message: {message: "error"},
  statusCode: 444,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(customlimit);


/* GET todo listing. */
router.post('/select', [
  check('user_id').not().isEmpty().isNumeric()
],function(req, res, next) {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    const id = req.body.user_id
    const desc = req.body.desc
    const q = 'select * from todo where userid=? order by todo_id ' + desc;
      con.query(q, [id], function(error, results, fields){
        if(error) throw error;
        res.send(results)
      });
  }

});

router.post('/desc', [
  check('id').not().isEmpty().isNumeric()
], function(req,res,next){
  const errors = validationResult(req);

  console.log(req.body.title)

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    const id = req.body.id
    console.log("request param:"+id)
    const q = "select * from todo where todo_id=? order by todo_id desc;"
    con.query(q, [id], (err, results, fields)=>{
      console.log("desc results:"+results)
      if(err) throw err;
      console.log("success to get desc!!")
      res.send(results)
    })
  }
})

router.post('/update', [
  check('todo_id').not().isEmpty().isNumeric(),
  check('flag').not().isEmpty().isBoolean()
],function(req, res, next){

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    var flag = req.body.flag
    if(flag){
      flag = 0
    }else{
      flag = 1
    }
    const q = "update todo set flag = ? where todo_id=?;";
    con.query(q, [flag, req.body.todo_id], (err, results, fields)=>{
      if(err)throw err;
      console.log("success update flag!");
      res.send(results)
    })
  }
})

router.post('/delete', [
  check('todo_id').not().isEmpty().isNumeric(),
  check('user_id').not().isEmpty().isNumeric(),
],function(req, res, next){
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).send({message:"bad request", flag:-1})
  }

  const todo_id = req.body.todo_id
  const id = req.body.user_id;
  const q = "delete from todo where todo_id=? and userid=? ;";
  con.query(q, [todo_id, id], (err, results, fields)=>{
    if(err)throw err;
    console.log("success delete flag!");
    res.send(results)
  })
})

router.post('/insert', [
  check('title').not().isEmpty().isLength({min:1, max:20}),
  check('desc').isLength({min:0, max:100}),
], function(req, res){
  console.log(req.body.user_id)
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{

    const p_title = req.body.title
    const p_todo = req.body.desc || ""
    const p_id = atob(req.body.user_id)


    con.query("select * from user where user_id = ?",[p_id], (error, results)=>{
      if(error){
        res.send({message:"userid is undefined", flag:-1})
      }
    })
  
    const q = "insert into todo(title, todo, flag, date, userid) values (?, ?, 0, now(), ?);";
    con.query(q ,[p_title, p_todo, p_id], (error, results, fields)=>{
      if(error) throw error;
      console.log("success to insert todo!!");
      res.send({message:"success to insert todo!!", flag:1})
    })
  }
})

router.post("/prog",function(req, res){
  const flag = req.body.flag
  const id = req.body.userid
  const desc = req.body.desc
  const q = "select * from todo where userid=? and flag=? order by todo_id "+desc;
  console.log(q)
  con.query(q, [id, flag], (err, results, fields)=>{
    if(err) throw err;
    res.send(results)
  })
})


//新規登録
router.post('/signup', [
  check('name').not().isEmpty().isLength({min:1, max:20}),
  check('email').not().isEmpty().isLength({min:5, max:30}).isEmail(),
  check('pass').not().isEmpty()
],function(req, res, next){

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.send({message:"bad request", flag:-1})
  }else{
    const name = req.body.name
    const email = req.body.email
    const pass = req.body.pass

    var q = "select name from user where name=?;";
    con.query(q, [name], (err, results, fields)=>{
      if(results[0] != undefined){
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

  if(!(str[0].length >= 1) || !(str[0].length <= 20) || !(str[1].length >= 1)){
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
      const token = jwt.sign(payload, "ionic-zemi-secret-key")
      return res.send({message:"ログインしました", flag:1, token, id:results[0].user_id})
    }
  })
  }catch(err){
    console.log(err)
  }

})

module.exports = router;