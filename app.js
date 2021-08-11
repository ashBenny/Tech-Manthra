const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDatabase = require('./config/db')

//Load config file
dotenv.config({ path : './config/config.env' })

//Passport configuration
require('./config/passport')(passport)

// Making DB connection
connectDatabase();

const app = express();

// Middleware
app.use(express.urlencoded({ extended : true }));
app.use(express.json());

// Method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}));

// Handlebar helpers
const { formatDate, stripTags, truncate, editIcon }  = require('./helpers/hbs');

// Express-hbs config
app.engine(
    '.hbs',
    exphbs({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
app.set('view engine', '.hbs');

// express-session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setting GLobal variable
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/stories',require('./routes/stories'));



const PORT = process.env.PORT || 3001
app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on PORT : ${process.env.PORT}`));