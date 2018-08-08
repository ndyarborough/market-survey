const express = require('express');
const router = express.Router();
const mailFunctions = require('../controllers/nodemailer');

// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('!w@xZnMjUd9!q+H*#5+9C9Ef55Z-J&Ye26SdBYTAx&f');

// Require Auth Functions
const auth = require('../controllers/auth');
// Require Models
const db = require('../models');

// Get Dashboard
router.get('/', auth.checkAuthentication, (req, res) => {
    console.log('// Checking Auth //');
    console.log(req.user);
    console.log('// Checking Auth //');
    res.render('home');
});

// My-Properties Page
router.get('/my-properties', auth.checkAuthentication, (req, res) => {
    // Load properties by user
    const name = `${req.user.firstName} ${req.user.lastName}`;
    let propertyArray = [];
    let propertyStatus = '';
    
    db.users.findOne({
        where: { id: req.user.id },
        include: [
            { model: db.properties }
        ]
    }).then(results => {
        console.log(results.dataValues.properties[0])
        for(var i = 0; i < results.dataValues.properties.length; i++) {
            let propertyObject = {};
                propertyObject.name = results.dataValues.properties[i].dataValues.name;
                propertyObject.email = results.dataValues.properties[i].dataValues.email;
                propertyObject.location = `${results.dataValues.properties[i].dataValues.city} ${results.dataValues.properties[i].dataValues.state}`;
                propertyObject.propertyStatus = results.dataValues.properties[i].status;
                propertyObject.propertyUserStatus = results.dataValues.properties[i].dataValues.propertiesUsers.dataValues.status;
                propertyArray.push(propertyObject);
        }
        res.render('my-properties', {
            name: name,
            properties: propertyArray,
            helpers: {
                renderPage: () => {
                    res.render('my-properties')
                }, 
                ifEquals: (arg1, arg2, options) => {
                    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
                },
                renderButtons: (propertyUserStatus, propertyStatus, name, location, email, options) => {

                    if (propertyStatus === 'Unverified' && propertyUserStatus === 'Unverified' ) {
                        return `
                        <div class="btn btn-primary small-btn" onclick="openModal(this)" data-property="${name} (${location})" data-propertyname="${name}" data-propertyemail="${email}" data-propertystatus="${propertyStatus}" data-modal="accessExceptionModal">Request Access</div>
                        <div class="btn btn-primary small-btn" onclick="openModal(this)" data-modal="forgetPropertyModal" data-propertyname="${name}" data-toggle="modal">Forget</div>
                        `;
                    } else if ((propertyStatus === 'Active' || propertyStatus === 'Setup') && (propertyUserStatus === 'Unverified' ||  propertyUserStatus === 'Denied'))  {
                        return `
                        <div class="btn btn-primary small-btn" onclick="openModal(this)" data-property="${name} (${location})" data-propertyname="${name}" data-propertyemail="${email}" data-propertystatus="${propertyStatus}" data-modal="accessModal">Request Access</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyUserStatus === 'Pending Admin' || propertyUserStatus === 'Pending Viewer' || propertyUserStatus === 'Pending Clerk') {
                        return `
                        <div class="btn btn-primary small-btn">Send Reminder</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Setup' && propertyUserStatus === 'Admin') {
                        return `
                        <div class="btn btn-primary small-btn">Setup</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Setup' && (propertyUserStatus === 'Viewer' || propertyUserStatus === 'Clerk')) {
                        return `
                        <div class="btn btn-dark small-btn">Setup</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Active' && propertyUserStatus === 'Admin')  {
                        return ` 
                        <div class="btn btn-primary small-btn">Pricing</div>
                        <div class="btn btn-primary small-btn">Settings</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Active' && propertyUserStatus === 'Clerk')  {
                        return `
                        <div class="btn btn-primary small-btn">Pricing</div>
                        <div class="btn btn-dark small-btn">Settings</div>
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Active' && propertyUserStatus === 'Viewer')  {
                        return `
                        <div class="btn btn-primary small-btn" data-toggle="modal" data-target="#removePropertyModal">Forget</div>
                        `
                    } else if (propertyStatus === 'Inactive' && propertyUserStatus === 'Admin')  {
                        return `
                        <div class="btn btn-primary small-btn">Settings (Inactive)</div>
                        `
                    }
                }
            }
        });  
    });
});

// User requests access to a property
router.post('/propertyUserVerification/:userId', (req, res) => {
    // Determine property Id
    db.properties.getPropertyIdByName(req.body.property, propertyId => {
        db.propertiesUsers.findOne({
            where: { 
                userId: req.params.userId,
                propertyId: propertyId
                }
        }).then(results => {
            // If the user hasn't tried to link with the property
            if(results === null) {
                // Create record of user-property verification request
                db.propertiesUsers.create({
                    status: 'Unverified',
                    propertyId: propertyId,
                    userId: req.params.userId
                });
                // Construct encrypted verification link
                db.properties.encryptUrl(propertyId, req.user.id, link => {
                    // Email property with encrypted link
                    mailFunctions.verifyUser(req.user, link); 
                });

                req.flash('success_msg', `An access request has been sent to ${req.body.property}`);
                res.redirect('/my-properties')

            } else {
                // User already attempted to access this property
                if(results.dataValues.status === 'Unverified') {
                    req.flash('error_msg', `Still waiting on ${req.body.property} to approve your access...`)
                    res.redirect('/add-property');
               }
               // User has already been verified by this property
               if(results.dataValues.status === 'Verified') {
                    req.flash('success_msg', `You already have access to ${req.body.property}`);
                    res.redirect('/add-property')
               }
           }
        });
    });
})

// Verify User to new property
router.get('/verify/user/:base64', (req, res) => {
    let payload;
    try {
        payload = urlCrypt.decryptObj(req.params.base64);
        // Making sure user is still 'Unverified'
        db.propertiesUsers.findOne({
            where: { propertyId: payload.propertyId, userId: payload.userId, status: 'Unverified' } 
        }).then(results => {
            if (results !== null) {
                db.propertiesUsers.changeStatus('Verified', payload.propertyId, payload.userId);
                res.render('/thank-you')
            } else {
                res.send('This Request has expired.')
            }
        })
    } catch(e) {
        // The link was mangled or tampered with.  
        return res.status(400).send('Bad request.  Please check the link.');
    }


});

// Verify Email Address
router.get('/verify/email/:base64', (req, res) => {
    let payload;
    try {
        payload = urlCrypt.decryptObj(req.params.base64);
    } catch(e) {
        // The link was mangled or tampered with.  
        return res.status(400).send('Bad request.  Please check the link.');
    }

    db.users.getUserByEmail(payload.email, user => {
        // If a user exists with payload.email
        if(user) {
            if(user.status === 'Unverified') {
                // Verify in Database, then send to login page
                db.users.changeStatus('Verified', user.id);
                req.flash('success_msg', 'Your email has been verified, please log in');
                res.redirect('/users/login');
            } else {
                req.flash('success_msg', 'Your email has already been verified, please log in');
                res.redirect('/users/login');
            }
        } else {
            return false;
        }
    });
    db.users.changeStatus('Verified', req.params.id);
});

router.get('/property-entry', auth.checkAuthentication, (req, res) => {
    res.render('property-entry');
});

// Admin can enter property to database
router.post('/property-entry', auth.checkAuthentication, (req, res) => {
        console.log('Route Hit!!!!!!!!!!')
        const { region, subRegion, name, address1, city, state, postalCode, lat, lng, phone, email, url } = req.body;
        // Form Validation
        req.checkBody('region', 'Region is required').notEmpty();
        req.checkBody('subRegion', 'Subregion is required').notEmpty();
        req.checkBody('name', 'Property Name is required').notEmpty();
        req.checkBody('address1', 'Street Address is required').notEmpty();
        req.checkBody('city', 'City is required').notEmpty();
        req.checkBody('state', 'Please Select a State').notEmpty();
        req.checkBody('postalCode', 'Zip/Postal Code is required').notEmpty();
        req.checkBody('lat', 'Lat is required').notEmpty();
        req.checkBody('lng', 'Lng is required').notEmpty();
        req.checkBody('url', 'Community Website is required').notEmpty();
        req.checkBody('email', 'Community Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
       
        const errors = req.validationErrors();
        
        if (errors) {
            res.render('property-entry', {
                errors: errors,
                region,
                subRegion,
                name,
                address1,
                city,
                state,
                postalCode,
                lat,
                lng,
                phone,
                email,
                url
            })
        } else {
            const geolocation = `POINT(${lat} ${lng})`;
            db.properties.findOne({
                where: { geolocation }
            }).then(result => {
                // If geolocation doesn't exist, create property
                if (result === null) {
                    // Enter data into db
                    db.properties.create({
                        region,
                        subRegion,
                        name,
                        address1,
                        city,
                        state,
                        postalCode,
                        email,
                        url,
                        phone,
                        geolocation,
                        status: 'Unverified'
                    });
                    
                    req.flash('success_msg', `${name} added to the database`)

                    res.redirect('/property-entry');
                } else {
                    const pId = result.dataValues.id;
                    // If geolocation already exist, update property
                    db.properties.update({
                        region,
                        subRegion,
                        name,
                        address1,
                        city,
                        state,
                        postalCode,
                        email,
                        url,
                        phone,
                        geolocation,
                    }, {
                    where: { id: pId},
                    returning: true,
                    plain: true
                    });

                    req.flash('success_msg', `${name} updated in the database`)

                    res.redirect('/property-entry');
                }

            }).catch(err => console.log(err))
        
        }
    });
    

// Add Property to my properties
router.get('/add-property', auth.checkAuthentication, (req, res) => {
    
        res.render('add-property', {
            user: req.user,
            regions: ['Raleigh-Durham', 'Tri-State'],
        });
});

// Forget Property from /my-properties
router.get('/forgetProperty/:propertyName', (req, res) => {
    // Get Property Id by  Property Name
    db.properties.getPropertyIdByName(req.params.propertyName, pId => {
        // Check if User is An Admin
        const isAdmin = db.propertiesUsers.isAdmin(pId, req.user.id);
        console.log('isAdmin: ' + isAdmin);
        if(isAdmin) {
            const numAdmins =  db.propertiesUsers.countAdmins(pId);
            console.log('numAdmins: ' + numAdmins)
            // Is the User the Last Admin?
            if(numAdmins <= 1) {
                // Sorry, you're the last Admin
                return 'Sorry';
            } else {
                // Remove Record from '/my-properties'
                db.propertiesUsers.removeProperty(pId, req.user.id);
            }
        } else { // Not an Admin
            // Remove Record from '/my-properties'
            db.propertiesUsers.removeProperty(pId, req.user.id);
        }
       

        // Remove Property from user's list by propertyId
        // db.propertiesUsers.removeProperty(pId, req.user.id);
    });
    // req.flash('success_msg', `You have successfully remove ${req.params.propertyName} from your properties`);
});

module.exports = router;