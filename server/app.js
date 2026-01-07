var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

require("dotenv").config();

const mongoose = require("mongoose");
mongoose
.connect(process.env.MONGODB_URI)
.then(() => {console.log("Database connected")})
.catch((err) => {console.log(err)})

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const classRouter = require("./routes/class");
const subjectRouter = require("./routes/subject");
const gradeRouter = require("./routes/grade");
const scheduleRouter = require("./routes/schedule");
const scheduleChangesRouter = require("./routes/scheduleChanges");
const messageRouter = require("./routes/message");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/class", classRouter);
app.use("/grade", gradeRouter);
app.use("/subject", subjectRouter);
app.use("/schedule", scheduleRouter);
app.use("/schedule-changes", scheduleChangesRouter);
app.use("/message", messageRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
