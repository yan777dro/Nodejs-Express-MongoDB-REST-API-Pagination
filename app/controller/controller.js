const db = require("../models");
const Student = db.students;

const getPagination = (page, size) => {  // five items will be fetched on page index 0
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

exports.create = (req, res) => {
  if (!req.body.lastName && !req.body.firstName) {
    res.status(400).send({ message: "Cannot be empty, please add student info" });
    return;
  }

  const student = new Student({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    major:    req.body.major,
    graduated: req.body.graduated ? req.body.graduated : false,
  });


  student
    .save(student)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Student not added, error occured ",
      });
    });
};

exports.findAll = (req, res) => {
  const { page, size, lastName } = req.query;
  var condition = lastName
    ? { lastName: { $regex: new RegExp(lastName), $options: "i" } }
    : {};

  const { limit, offset } = getPagination(page, size);

  Student.paginate(condition, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        students: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Cannot retrieve all students, error occured",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Student.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Could not find student by Id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving student with Id" + id });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Student.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update a student info with id=${id}. Perhaps the student is not found`,
        });
      } else res.send({ message: "Student info updated." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating student  with id=" + id,
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  Student.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete student  with id=${id}. Student not found`,
        });
      } else {
        res.send({
          message: "Student was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Cannot delete student with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Student.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} All students were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error occured while deleting students.",
      });
    });
};

exports.findAllGraduated = (req, res) => { // find all students that have graduated
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Student.paginate({ graduated: true }, { offset, limit })
    .then((data) => {
      res.send({
        totalItems: data.totalDocs,
        students: data.docs,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error occured while retrieving students that graduated",
      });
    });
};