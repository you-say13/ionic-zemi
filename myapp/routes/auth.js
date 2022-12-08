const express = require('express');
const router = express.Router();
const session = require('express-session');

// const redis = require('redis')
// const RedisStore = require('connect-redis')(session);
// let redisClient = redis.createClient(6379, 'redis');
// redisClient.connect().catch(console.error)


// router.use(session({
//     name: 'redis-test-ionic-and-vue',
//     secret: 'ionic-vue-zemi',
//     resave: false,
//     saveUninitialized: false,
//     store: new RedisStore({ client: redisClient }),
//     cookie:{
//     secure: false,
//     httpOnly: false
//     }
// }))

router.use(session({
    secret : 'ionic-vue-zemi',
    resave: false,
    saveUninitialized: false,
}))


router.get('/', (req, res)=>{
    var session = req.session;
    if(session && session.count){
        session.count++;
    }else{
        session.count = 1;
    }
    res.send('Hello World! Count:'+session.count);
})

router.get('/delete', (req, res)=>{
    
})


module.exports = router;