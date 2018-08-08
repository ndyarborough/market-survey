const bcrypt = require('bcryptjs');
// Initialize with a 43 char base64 password.  Google 'password generator'
var urlCrypt = require('url-crypt')('!w@xZnMjUd9!q+H*#5+9C9Ef55Z-J&Ye26SdBYTAx&f');


module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define("users", {
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
          isEmail: {
              arg: true,
              msg: 'Please enter a valid email address.'
          }
      }
    },

    firstName: {
        type: DataTypes.STRING(25),
        allowNull: false
    },

    lastName: {
        type: DataTypes.STRING(25),
        allowNull: false
    },

    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
  
    status: {
        type: DataTypes.STRING(25),
        defaultValue: 'Unverified'
    }  
  });

  // Model Functions
  Users.encryptUrl = (email, callback) => {
    // Encrypt your data
    var payload = {
      email: email,
      date: new Date(),
      // ip: req.ip,
    };
    var base64 = urlCrypt.cryptObj(payload);

    // make a link
    var registrationUrl = 'http://' + 'localhost:3000' + '/verify/email/' + base64;
    callback(registrationUrl);
  }

  Users.hashId = (id, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(id.toString(), salt, function(err, hash) {
        if(err) throw err;
        callback(hash);
    });
});
  }

  Users.checkStatus = (id, callback) => {
    Users.findAll({
      attributes: ['status'],
      where: { id: id }
    }).then(status => console.log(status))
      .catch(err => console.log(err));
  }

  Users.hashPassword = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        Users.create(newUser)
          .then((newUser) => {
            callback(newUser);
          })
          .catch(error => {
            console.log(error)
          });
      })
    })
  }

  Users.changeStatus = (newStatus, userId) => {
    console.log('newStatus: ' + newStatus);
    Users.update({
      status: newStatus
    }, {
      where: { id: userId }
    }).then(user => {
      // console.log(user)
    })
    .catch(err => console.log(err));

  }

  // Search for a record by email
  Users.getUserByEmail = (email, callback) => {
    Users.findAll({
      limit: 1,
      where: {
        email: email
      }
    }).then(result => {
        if(result.length === 0) {
          callback();
        } else {
          callback(result[0].dataValues); 
        }
      });
    // SELECT * FROM Users WHERE username = username
  }

  Users.getUserById = (id, callback) => {
    Users.findAll({
      limit: 1,
      where: {
        id: id
      }
    }).then(result => { 
        if(result.length === 0) {
          callback();
        } else {
          callback(result[0].dataValues); 
        }
      })
      .catch(err => {
          if(err) throw err;
      });
  }

  Users.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(isMatch);
    })
  }

  return Users;
};