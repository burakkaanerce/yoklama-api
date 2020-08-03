const db = require("../models");
const Lecture = db.Lecture;
const Op = db.Sequelize.Op;

exports.list = (req, res) => {
  const code = req.body.code;
  const name = req.body.name;
  const lecturerId = req.body.lecturerId;

  let condition = !code && !name && !lecturerId ? null : {};
  if(code) {
    condition.code = { [Op.iLike]: `%${code}%` }
  }
  if(name) {
    condition.name = { [Op.iLike]: `%${name}%` }
  }
  if(lecturerId) {
    condition.LecturerId = lecturerId
  }

  return Lecture.findAll({ where: condition })
    .then(data => {
      return res.json({success: true, lecture: data});
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lectures."
      });
    });
};

exports.add = (req, res) => {
  const code = req.body.code;
  const name = req.body.name;
  const lecturerId = req.body.lecturerId;

  console.log(code, name, lecturerId)

  if(code && name && lecturerId) {
    const newLecture = {
      name,
      code,
      LecturerId: lecturerId
    }
    return Lecture.create(newLecture)
      .then(data => {
        return res.json({success: true, lecture: data});
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while adding lecture."
        });
      });
  } else {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while adding lecture."
    });
  }
}