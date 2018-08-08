const db = require('../models');

module.exports = (sequelize, DataTypes) => {
    var PropertiesUsers = sequelize.define("propertiesUsers", {
        status: {
            type: DataTypes.STRING(25),
            defaultValue: 'Unverified'
        }
    });

// Foreign Keys
//   db.properties.belongsToMany(db.users, {through: db.propertiesUsers});
//   db.users.belongsToMany(db.properties, {through: db.propertiesUsers});


    // Model Functions
    
    PropertiesUsers.getUserProperties = (userId, propertyTable, callback) => {
        console.log('[[[[[[[[[[[[[[[[[[[[[[');
        console.log(propertyTable);
        console.log('[[[[[[[[[[[[[[[[[[[[[[');

        PropertiesUsers.findAll({
            include: [
                    { model: propertyTable }
            ],
        })
            .then(results => {
                callback(results);
            })
            .catch(err => console.log(err))
    }

    PropertiesUsers.changeStatus = (newStatus, propertyId, userId) => {
        PropertiesUsers.update(
            {status: newStatus},
            {where: { propertyId: propertyId, userId: userId } }
        ).then(results => console.log(results))
            .catch(err => console.log(err));
    }

    PropertiesUsers.removeProperty = (propertyId, userId) => {
        console.log('===========Removing Property==========')
        PropertiesUsers.destroy({
            where: {
                propertyId,
                userId
            }
        }).then(results => console.log(results))
            .catch(err => console.log(err));
    }

    PropertiesUsers.isAdmin = (propertyId, userId) => {
        console.log('=======isAdmin=========')
        PropertiesUsers.findOne({
            where: {
                propertyId,
                userId
            },
            raw: true   
        }).then(results => {
            console.log(results.properties)
            // const status = result.dataValues.status;
            // if(status === 'Admin') {
            //     return true;
            // } else {
            //     return false;
            // }
        }).catch(err => console.log(err));
    }

    PropertiesUsers.countAdmins = (propertyId) => {
        console.log('==============Count Admins=============');
        PropertiesUsers.count({
            where: { status: 'Admin' }
        }).then(result => console.log(result))
            .catch(err => console.log(err));
    }

      return PropertiesUsers;
    };