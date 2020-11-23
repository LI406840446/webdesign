var MongoClient = require('mongodb').MongoClient;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//前端顯示資料庫資料
app.get('/json', function(req, res, next){
  MongoClient.connect('mongodb://127.0.0.1', function(err, db){ //連接mongdb
    if(!err) {
      var dbo = db.db('myDemo')
      dbo.collection('userlist').find().toArray(function(err, data) {
        if(!err) {
          res.json(data)//express json 可以直接讓資料讀出來
        }
      })
    }
  })
})


//送出資料的路由(router)       //express 接收req,res
app.get('/senddata', function(req, res, next){
  var username = req.query.username//query接收參數(id)
  var phone = req.query.phone
  var email = req.query.email
  console.log(username, phone, email)

  MongoClient.connect('mongodb://127.0.0.1', function(err, db){ //連接mongdb
    if (!err){
      //console.log("連線成功")
      //寫入資料 //insert collection到資料庫
      var dbo = db.db('myDemo')
      dbo.collection("userlist").insert({ username: username, phone: phone, email: email}, function(err, result){
        if(!err) {
          console.log("寫入成功")
        } else {
          console.log("寫入失敗")
        }
      })
    } else {
      console.log("連線失敗", err)
    }
    res.end()
  })
  
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
