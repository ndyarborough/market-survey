const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const db = require('../models');
const auth = require('../controllers/auth');

// Login Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
    (email, password, done) => {
        db.users.getUserByEmail(email, 
            // Callback
            (user) => {
                console.log('==================');
                console.log(user);
                console.log('==================');
                if(!user) {
                    return done(null, false, { message: 'Unknown User'});
                }
                db.users.comparePassword(password, user.password, (isMatch) => {
                    if(isMatch) {
                        // Switch Case based on Status
                        console.log('Status: ' + user.status);
                        switch(user.status) {
                            case 'Unverified':
                                return done(null, false, { message: 'You have not yet verified your email address, would you like to send it again?'});
                                break;
                            case 'Active':
                                return done(null, user);
                                break;
                            case 'Verified':
                                db.users.changeStatus('Active', user.id);
                                return done(null, user);
                                break;
                            case 'Suspended':
                                return done(null, false, { message: 'Your account has been suspended'});
                                break;
                            default:
                                return done(null, false, { message: 'Invalid Account Status, check your Login Credentials'})
                            }

                    }
                    else {
                        return done(null, false, { message: 'Invalid Password'});
                    }
                });
        });
}));

// Serialize Session
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize Session
passport.deserializeUser((id, done) => {
    db.users.getUserById(id, user => {
        done(null, user);
    });
});

module.exports = passport;