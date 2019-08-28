const Router = require('express')
const userController = require('@controllers/userController')
const studentController = require('@controllers/studentController')
const { authentication } = require('@util/authenticationMiddleware')
const { checkAdmin, checkStaffOrAdmin } = require('@util/adminMiddleware')
const { checkDistributor } = require('@util/distributorMiddleware')
const { checkStaff } = require('@util/staffMiddleware')

const router = Router()

router.get('/', (req, res) => {
  res.send('root')
})

router.post('/logout', userController.getLogoutUrl)

router.use('/', authentication)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/request_device', userController.requestDevice)
router.post('/claim_device', checkDistributor, userController.claimDevice)

router.get('/user', checkAdmin, userController.getAllUsers)
router.post('/user/:id/staff', checkAdmin, userController.toggleStaff)
router.post('/user/:id/distributor', checkAdmin, userController.toggleDistributor)

router.get('/student/:studentNumber', checkDistributor, studentController.getStudent)
router.post('/student/:studentNumber/eligible', checkStaffOrAdmin, studentController.markStudentEligible)
router.post('/student/:studentNumber/status', checkStaff, studentController.updateStudentStatus)

router.get('/staff/students', checkStaff, studentController.getStudentsForStaff)

router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
