const db = require("../models");
const Registration = db.Registration;
const Lecture = db.Lecture;
const Lecturer = db.Lecturer;
const Op = db.Sequelize.Op;

exports.list = (req, res) => {
  const lectureId = req.body.lectureId;
  const lecturerId = req.body.lecturerId;

  let condition = !lectureId && !lecturerId ? null : {};
  if(lectureId) {
    condition.LectureId = lectureId
  }
  if(lecturerId) {
    condition.LecturerId = lecturerId
  }

  console.log(lectureId, lecturerId, condition)

  return Registration.findAll({ where: condition,
    include: [
      {
        model: Lecture
      },
      {
        model: Lecturer
      }
    ] })
    .then(data => {
      return res.json({success: true, registration: data});
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving registrations."
      });
    });
}

exports.add = (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const lectureId = req.body.lectureId;
  const lecturerId = req.body.lecturerId;

  console.log(startDate, endDate, lectureId, lecturerId)

  if(startDate && endDate && lectureId && lecturerId) {
    const newRegistration = {
      list: [],
      status: 0,
      start_date: startDate,
      end_date: endDate,
      LectureId: lectureId,
      LecturerId: lecturerId
    }
    return Registration.create(newRegistration)
      .then(data => {
        return res.json({success: true, registration: data});
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Some error occurred while adding registration."
        });
      });
  } else {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while adding registration."
    });
  }
}