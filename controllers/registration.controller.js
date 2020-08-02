const db = require("../models");
const Registration = db.Registration;
const Lecture = db.Lecture;
const Lecturer = db.Lecturer;
const Op = db.Sequelize.Op;

const Excel = require('exceljs')

exports.find = (req, res) => {
  const id = req.body.id;

  if(!id) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving registrations."
    });
  }

  return Registration.findAll({ where: {id: id},
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

  return Registration.findAll({
    where: condition,
    include: [
      {
        model: Lecture
      },
      {
        model: Lecturer
      }
    ],
    order: [
      ['id', 'DESC'],
    ],
  })
    .then(async data => {
      await data.sort((a, b) => a.id > b.id)
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

exports.register = (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const stuNo = req.body.stuNo;
  const registrationId = req.body.registrationId;

  if(firstname && lastname && stuNo && registrationId) {
    return Registration.findAll({ where: {id: registrationId}})
      .then(data => {
        if(data.length === 0) {
          return res.status(500).send({
            message:
              err.message || "Registration is not found"
          });
        }

        const { list } = data[0]

        console.log("list: ", list)

        if(list.some((value) => {
          return value.firstname === firstname && value.lastname === lastname && value.stuNo === stuNo
        })) {
          return res.status(500).send({
            message:
              "Registration includes this user"
          });
        }

        list.push({firstname, lastname, stuNo});

        return Registration.update({list: list}, {
          where: { id: registrationId }
        })
          .then(num => {
            if (num == 1) {
              return res.json({success: true, message: 'Updated'});
            } else {
              return res.status(500).send({
                message:
                  "Registration is not updated because it does not exist"
              });
            }
          })
          .catch(err => {
            return res.status(500).send({
              message:
                err.message || "Registration is not updated"
            });
          });
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Registration cannot find"
        });
      });
  } else {
    return res.status(500).send({
      message:
        "Invalid Credentials"
    });
  }
}

exports.close = (req, res) => {
  const registrationId = req.body.registrationId;

  if(registrationId) {
    return Registration.findAll({ where: {id: registrationId}})
      .then(data => {
        if(data.length === 0) {
          return res.status(500).send({
            message:
              err.message || "Registration is not found"
          });
        }

        const { status } = data[0]

        const newStatus = !status;

        console.log("data: ", data[0])
        console.log("newStatus: ", newStatus)

        return Registration.update({status: newStatus}, {
          where: { id: registrationId }
        })
          .then(num => {
            if (num == 1) {
              return res.json({success: true, message: 'Updated'});
            } else {
              return res.status(500).send({
                message:
                  "Registration is not updated because it does not exist"
              });
            }
          })
          .catch(err => {
            return res.status(500).send({
              message:
                err.message || "Registration is not updated"
            });
          });
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Registration cannot find"
        });
      });
  } else {
    return res.status(500).send({
      message:
        "Invalid Credentials"
    });
  }
}

exports.download = (req, res) => {
  const registrationId = req.body.registrationId;

  if(registrationId) {
    return Registration.findAll({ where: {id: registrationId}})
      .then(async data => {
        if(data.length === 0) {
          return res.status(500).send({
            message:
              err.message || "Registration is not found"
          });
        }

        const { list } = data[0];

        let workbook = new Excel.Workbook()
        let worksheet = workbook.addWorksheet('Yoklama')

        worksheet.columns = [
          {header: '#', key: 'id'},
          {header: 'Adı', key: 'firstname'},
          {header: 'Soyadı', key: 'lastname'},
          {header: 'Öğrenci Numarası', key: 'stuNo'},
        ]

        worksheet.columns.forEach(column => {
          column.width = column.header.length < 12 ? 12 : column.header.length
        })
        
        worksheet.getRow(1).font = {bold: true}

        list.forEach((e, index) => {
          const rowIndex = index + 2
        
          worksheet.addRow({
            id: index + 1,
            ...e,
          })
        })
        
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          worksheet.getCell(`A${rowNumber}`).border = {
            top: {style: 'thin'},
            left: {style: 'thin'},
            bottom: {style: 'thin'},
            right: {style: 'none'}
          }
        
          const insideColumns = ['B', 'C', 'D', 'E']
          insideColumns.forEach((v) => {
            worksheet.getCell(`${v}${rowNumber}`).border = {
              top: {style: 'thin'},
              bottom: {style: 'thin'},
              left: {style: 'none'},
              right: {style: 'none'}
            }
          })
        
          worksheet.getCell(`F${rowNumber}`).border = {
            top: {style: 'thin'},
            left: {style: 'none'},
            bottom: {style: 'thin'},
            right: {style: 'thin'}
          }
        })

        await workbook.xlsx.writeFile('Yoklama.xlsx')

        return res.json({success: true, message: 'Created'});

        /* const { status } = data[0]

        const newStatus = !status;

        return Registration.update({status: newStatus}, {
          where: { id: registrationId }
        })
          .then(num => {
            if (num == 1) {
              return res.json({success: true, message: 'Updated'});
            } else {
              return res.status(500).send({
                message:
                  "Registration is not updated because it does not exist"
              });
            }
          })
          .catch(err => {
            return res.status(500).send({
              message:
                err.message || "Registration is not updated"
            });
          }); */
      })
      .catch(err => {
        return res.status(500).send({
          message:
            err.message || "Registration cannot find"
        });
      });
  } else {
    return res.status(500).send({
      message:
        "Invalid Credentials"
    });
  }
}