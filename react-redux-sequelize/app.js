// Dependencies
const express = require('express')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const routes = require('./app/routes/index');
const users = require('./app/routes/users');
const api = require('./app/routes/api-routes');

// Hooks in Sequelize Config
const db = require('./app/models');

// Initialize App
const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// CookieParser Middleware
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Enable CORS
app.use(cors());

// Passport Init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.');
        const root = namespace.shift();
        const formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// // Connect Flash
// app.use(flash());

// // Global Vars
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     res.locals.user = req.user || null;
//     next();
// }); 

// Routes Config
app.use('/', routes);
app.use('/users', users);
app.use('/api', api);

// Set Port
app.set('port', (process.env.PORT || 4000));

// Sync Database
db.sequelize.sync()
  .then(() => {
    // Run server to declared port
    app.listen(app.get('port'), () => {
        console.log('Nice! Database looks fine')
        console.log(`Server started on ${app.get('port')}`);
    });
   }).catch((err) => {
       console.log(err, 'Something went wrong with the Database Update!');
   });