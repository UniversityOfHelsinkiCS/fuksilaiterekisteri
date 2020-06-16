const Router = require('express')
const userController = require('@controllers/userController')
const studentController = require('@controllers/studentController')
const testController = require('@controllers/testController')
const emailController = require('@controllers/emailController')
const serviceStatusController = require('@controllers/serviceStatusController')
const { authentication } = require('@util/authenticationMiddleware')
const { checkAdmin, checkStaffOrAdmin } = require('@util/adminMiddleware')
const { checkDistributor } = require('@util/distributorMiddleware')
const { checkStaff } = require('@util/staffMiddleware')
const { validationMiddleware } = require('@util/validationMiddleware')
const { inProduction } = require('@util/common')

const router = Router()

router.get('/', (req, res) => {
  res.send('root')
})

router.post('/logout', userController.getLogoutUrl)

if (!inProduction) {
  router.get('/test/reset/user', testController.resetTestUsers)
  router.get('/test/reset/serviceStatus', testController.resetServiceStatus)
}

router.get('/serviceStatus', serviceStatusController.getServiceStatus) // Before authentication, because contains translations and does not contain any sensitive data.

router.use('/', authentication)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/request_device', userController.requestDevice)
router.post('/claim_device', checkDistributor, userController.claimDevice)

router.get('/user', checkAdmin, userController.getAllUsers)
router.post('/user/:id/staff', checkAdmin, userController.toggleStaff)
router.post('/user/:id/distributor', checkAdmin, userController.toggleDistributor)
router.post('/user/:id/admin_note', checkAdmin, validationMiddleware(['id'], ['note']), userController.setAdminNote)

router.get('/student/:studentNumber', checkDistributor, studentController.getStudent)
router.post('/student/:studentNumber/eligible', checkStaffOrAdmin, studentController.markStudentEligible)
router.post('/student/:studentNumber/status', checkStaff, studentController.updateStudentStatus)

router.get('/staff/students', checkStaff, studentController.getStudentsForStaff)

router.post('/email/send', emailController.sendEmail)
router.get('/email/template/autosend/:type', emailController.getAutosendTemplate)
router.post('/email/template/autosend', emailController.updateAutosendTemplate)

router.post('/serviceStatus', checkAdmin, serviceStatusController.setServiceStatus)

router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
