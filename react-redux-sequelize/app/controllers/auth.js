const auth = {
    checkAuthentication: (req, res, next) => {
        console.log('Checking Authentication')
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('error_msg', 'You are not logged in');
            res.redirect('/users/login');
        }
    }
}

module.exports = auth;