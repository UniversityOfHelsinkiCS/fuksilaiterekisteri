const authentication = (req, res, next) => {
  console.log(req.headers)
  console.log('UID', req.headers.uid)


  next()
}


module.exports = authentication
