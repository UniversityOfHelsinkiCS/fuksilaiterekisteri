const Router = require('express')
const userController = require('@controllers/userController')
const studentController = require('@controllers/studentController')
const testController = require('@controllers/testController')
const emailController = require('@controllers/emailController')
const serviceStatusController = require('@controllers/serviceStatusController')
const studyProgrammeController = require('@controllers/studyProgrammeController')
const { authentication } = require('@util/authenticationMiddleware')
const { checkAdmin, checkStaffOrAdmin } = require('@util/adminMiddleware')
const { checkDistributor } = require('@util/distributorMiddleware')
const { checkStaff } = require('@util/staffMiddleware')
const { checkReclaimer } = require('@util/reclaimerMiddleware')
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
  router.get('/test/disableStudentRegs', testController.disableStudentRegs)
  router.get('/test/createSomeUsers', testController.createSomeUsers)
  router.get('/test/advance', testController.advance)
  router.post('/test/createUser', testController.createUser)
  router.get('/test/setSerial/:serial', testController.setSerial)
  router.get('/test/setServiceStatus', testController.setServiceStatus)
}

router.get('/serviceStatus', serviceStatusController.getServiceStatus) // Before authentication, because contains translations and does not contain any sensitive data.
router.get('/studyProgrammes', studyProgrammeController.getAll)

router.use('/', authentication)

router.get('/ping', (req, res) => res.send('pong'))

router.post('/login', userController.getUser)
router.post('/request_device', userController.requestDevice)
router.post('/claim_device', checkDistributor, userController.claimDevice)

router.get('/user', checkAdmin, userController.getAllUsers)
router.post('/user/:id/:role', checkAdmin, userController.toggleRole)
router.post('/user/:id/admin_note', checkAdmin, validationMiddleware(['id'], ['note']), userController.setAdminNote)

router.get('/student/:studentNumber', checkDistributor, studentController.getStudent)
router.post('/student/:studentNumber/eligible', checkStaffOrAdmin, studentController.markStudentEligible)
router.post('/student/:studentNumber/deviceReturned', checkStaffOrAdmin, studentController.markDeviceReturned)
router.post('/student/:studentNumber/status', checkStaff, studentController.updateStudentStatus)
router.post('/student/:studentNumber/reclaim_status', checkReclaimer, studentController.updateStudentReclaimStatus)

router.get('/staff/students', checkStaff, studentController.getStudentsForStaff)

router.get('/reclaimer/students', checkReclaimer, studentController.getStudentsForReclaimer)
router.get('/reclaimer/update', checkReclaimer, studentController.updateReclaimStatuses)

router.post('/email/send', checkAdmin, emailController.sendAdminEmail)
router.get('/email/template/autosend/:type', checkAdmin, emailController.getAutosendTemplate)
router.post('/email/template/autosend', checkAdmin, emailController.updateAutosendTemplate)
router.post('/email/reclaimer/send', checkReclaimer, emailController.sendReclaimerEmail)

router.post('/serviceStatus', checkAdmin, serviceStatusController.setServiceStatus)

router.post('/studyProgrammes', checkAdmin, studyProgrammeController.update)
router.use('*', (req, res) => res.sendStatus(404))

module.exports = router
