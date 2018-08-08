const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Require Db
const db = require('../models');
// Require Controllers
const mailFunctions = require('../controllers/nodemailer');
const auth = require('../controllers/auth');

// Routes //
router.get('/register', (req, res) => {
    res.send('register');
});

// Register
router.post('/register', (req, res) => {
    console.log('Registering...')
    console.log('req.body', req.body)
    // // Validation
    req.checkBody('firstName', 'First Name is required').notEmpty();
    req.checkBody('lastName', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be at least 8 Characters').len(8);
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    console.log('errors', errors)
    
    if (errors) {
       res.send(errors);
    } else {

        // Check if email already exists
        db.users.find({ where: { email: req.body.email}})
            .then(userFile => {
                if(userFile) {
                    // If email exists
                    // req.flash('error_msg', 'This email address is already registered');

                    // res.redirect('/users/register');
                    res.send('User Exists')
                } else {
                     // If new email
                    const newUser = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        status: 'Unverified'
                    }; 
                    let userId;

                    db.users.hashPassword(newUser, (user) => {
                        db.users.encryptUrl(user.dataValues.email, link => {
                            mailFunctions.verifyEmail(req.body.email, link);
                        });
                    });

                    res.send('Successfully Registered')
                }
            })
        }
});

// Get Login
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Route
router.post('/login', 
    passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
    (req, res) => {


    // res.redirect('/');
});


router.get('/logout', (req, res) => {
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
})


module.exports = router;