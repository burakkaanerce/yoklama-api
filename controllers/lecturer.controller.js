const db = require("../models");
const Lecturer = db.Lecturer
const Op = db.Sequelize.Op; 

const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  return Lecturer
    .findOne({
      where: {
        email: req.body.email
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          message: 'Authentication failed. User not found.',
          error: "NOT_FOUND"
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(isMatch && !err) {
          var token = jwt.sign(JSON.parse(JSON.stringify(user)), 'yoklamaauthsecret', {expiresIn: 86400 * 30});
          jwt.verify(token, 'yoklamaauthsecret', function(err, data){
            console.log(err, data);
          })
          return res.json({success: true, token: token, user: user});
        } else {
          return res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});
        }
      })
    })
    .catch((error) => res.status(400).send(error));
};

exports.signup = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
    res.status(400).send({message: 'E-mail and password is not given credentials.', error: 'MISSED_CREDENTIALS'})
  } else {
    Lecturer
    .findOne({
      where: {
        email: req.body.email
      }
    })
    .then((user) => {
      if(!user) {
        Lecturer
          .create({
            email: req.body.email,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname
          })
          .then((user) => res.status(201).send(user))
          .catch((error) => {
            console.log(error);
            res.status(400).send(error);
          });
      } else {
        return res.status(401).send({success: false, message: 'User is found'});
      }
    })
    .catch((error) => res.status(400).send(error));
    
  }
};
