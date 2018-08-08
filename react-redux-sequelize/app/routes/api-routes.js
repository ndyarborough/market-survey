const express = require('express');
const router = express.Router();

const mailFunctions = require('../controllers/nodemailer');
const db = require('../models');

// Generate Property List for '/add-property'
router.get('/properties/:region', (req, res) => {
    db.properties.findAll({
        attributes: ['name', 'id'],
        where: {
            region: req.params.region
        }
    }).then(results => {
        res.json(results);
    }).catch(err => console.log(err));
});

router.get('/checkProperties/:lat/:lng', (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;

    db.properties.findOne({
        where: { geolocation: `POINT(${lat} ${lng})`}
    }).then(result => {
    
        res.json(result);
        
    }).catch(err => console.log(err));
})

// Send User-Property Verification email
router.get('/sendPropertyUserVerification/:propertyName', (req, res) => {
    console.log('------req.params.propertyName------');
    console.log(req.params.propertyName);
    console.log('------req.params.propertyName------');
    
    db.properties.getPropertyIdByName(req.params.propertyName, pId => {
        db.properties.encryptUrl(pId, req.user.id, link => {
            mailFunctions.verifyUser(req.user, link);
        })
    })
});

module.exports = router;