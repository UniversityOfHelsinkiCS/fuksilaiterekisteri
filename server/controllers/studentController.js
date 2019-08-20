const getStudent = (req, res) => {
  res.send({ number: req.params.studentNumber })
}


module.exports = {
  getStudent,
}
