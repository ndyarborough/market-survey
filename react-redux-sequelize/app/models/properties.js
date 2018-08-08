var urlCrypt = require('url-crypt')('!w@xZnMjUd9!q+H*#5+9C9Ef55Z-J&Ye26SdBYTAx&f');

module.exports = (sequelize, DataTypes) => {
  var Properties = sequelize.define("properties", {
    region: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
  
    subRegion: {
        type: DataTypes.STRING(25),
        allowNull: false
    },

    name: {
        type: DataTypes.STRING(45),
    },

    address1: {
        type: DataTypes.STRING(45),
    },

    address2: {
        type: DataTypes.STRING(45),
    },

    city: {
        type: DataTypes.STRING(25),
    },

    state: {
        type: DataTypes.STRING(2),
    },

    postalCode: {
        type: DataTypes.STRING(10),
    },  

    image: {
        type: DataTypes.STRING(25),
    },

    url: {
        type: DataTypes.STRING(64),
        validate: {
            isUrl: {
                arg: true,
                msg: 'Please enter a valid URL.'
            }
        }
    },

    phone: {
        type: DataTypes.STRING(20)
    },

    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: {
                arg: true,
                msg: 'Please enter a valid email address.'
            }
        }
    },

    geolocation: {
        type: DataTypes.STRING,
        unique: true,
    },

    yearBuilt: {
        type: DataTypes.INTEGER,
    },
    
    yearRebuilt: {
        type: DataTypes.INTEGER,
    },

    units: {
        type: DataTypes.INTEGER,
    },

    owner: {
        type: DataTypes.STRING(25),
    },

    management: {
        type: DataTypes.STRING(25),
    },

    status: {
      type: DataTypes.STRING(25),
      defaultValue: 'Unverified'
    }
  });
  
    // Model Functions
    Properties.getPropertyIdByName = (propertyName, callback) => {
        console.log('=====Property Name=======');
        console.log(propertyName);
        console.log('=====Property Name=======');

        Properties.findOne({
            attributes: ['id'],
            where: { name: propertyName }
        }).then(result => callback(result.dataValues.id))
            .catch(err => console.log(err));
    }

    Properties.encryptUrl = (propertyId, userId, callback) => {
        // Encrypt your data
        var payload = {
            propertyId: propertyId,
            userId: userId,
            date: new Date(),
        };
        var base64 = urlCrypt.cryptObj(payload);
  
        // make a link
        var registrationUrl = 'http://' + 'localhost:3000' + '/verify/user/' + base64;
        callback(registrationUrl);
    }
  
    return Properties;
  };