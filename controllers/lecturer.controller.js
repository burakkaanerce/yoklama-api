const db = require("../models");
/* const Tutorial = db.tutorials;
const Op = db.Sequelize.Op; */
const Lecturer = db.Lecturer
const Op = db.Sequelize.Op; 

exports.login = (req, res) => {
  console.log({...req.body});
  console.log("Lecturer: ", Lecturer);
  res.send('respond with a resource');
  return;
};
